"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type {
  FileType,
  UploadStatus,
  PersistedFile,
  UploadingFile,
} from "@/types/upload";

// Preparacion Step Data
type EspesorOption = "4" | "5" | "6" | "otro";
type OrigenOption = "original" | "plantilla" | "unidad" | "plano" | "otro";

interface PreparacionData {
  espesores: EspesorOption[];
  espesorCustom: string;
  tolerancia: string;
  origen: OrigenOption | "";
  origenCustom: string;
}

// Diseno Step Data - Legacy (kept for compatibility during transition)
interface UploadedFile {
  id: string;
  file: File;
  preview: string | null;
  type: "image" | "text" | "cad";
}

interface DisenoData {
  files: UploadedFile[];
  // New persisted files support
  persistedFiles: PersistedFile[];
  uploadingFiles: UploadingFile[];
}

// Corte Step Data
interface CorteData {
  ejeX: string;
  ejeY: string;
  area: string;
}

// Barrenos Step Data
interface Barreno {
  x: string;
  y: string;
  diametro: string;
}
interface BarrenosData {
  aplica: boolean;
  cantidadBarrenos: number;
  barrenos: Barreno[];
}

// Pulido Step Data
const TIPO_PULIDO_OPTIONS = ["2", "4", "Mixto"] as const;
type TipoPulidoOption = (typeof TIPO_PULIDO_OPTIONS)[number];

interface PulidoData {
  metrosLineales: string;
  tipoPulido: TipoPulidoOption | "";
}

// Templado Step Data
type TipoMoldeOption = "Plano" | "Cilíndrico" | "Esférico" | "Cónico" | "";
type TipoProcesoOption = "Maquila" | "Fábrica" | "";

interface TempladoData {
  tipoMolde: TipoMoldeOption;
  tipoProceso: TipoProcesoOption;
  radioCilindro: string;
}

// Serigrafia Step Data
interface SerigrafiaData {
  aplica: boolean;
  color: "negro" | "otro" | "";
  defroster_aplica: boolean;
  defroster_area: string;
}

// Marca Step Data
interface MarcaData {
  marca: string;
  colorMarca: string;
  numeroMain: string;
  coordenadasMain: string;
}

// Observaciones Step Data
interface ObservacionesData {
  notas: string;
}

// Origin Sheet Info (Header)
interface OriginSheetInfo {
  rhinoCode: string;
  descripcion: string;
  claveExterna: string;
}

// All Form Data
interface FormData {
  originSheetInfo: OriginSheetInfo;
  preparacion: PreparacionData;
  diseno: DisenoData;
  corte: CorteData;
  barrenos: BarrenosData;
  templado: TempladoData;
  pulido: PulidoData;
  serigrafia: SerigrafiaData;
  marca: MarcaData;
  observaciones: ObservacionesData;
}

interface FormDataContextType {
  formData: FormData;
  updateOriginSheetInfo: (data: Partial<OriginSheetInfo>) => void;
  updatePreparacion: (data: Partial<PreparacionData>) => void;
  updateDiseno: (data: Partial<DisenoData>) => void;
  addDisenoFile: (file: UploadedFile) => void;
  removeDisenoFile: (id: string) => void;
  // New persisted file methods
  setPersistedFiles: (files: PersistedFile[]) => void;
  addPersistedFile: (file: PersistedFile) => void;
  removePersistedFile: (id: string) => void;
  addUploadingFile: (file: UploadingFile) => void;
  updateUploadingFile: (id: string, updates: Partial<UploadingFile>) => void;
  removeUploadingFile: (id: string) => void;
  updateCorte: (data: Partial<CorteData>) => void;
  updateBarrenos: (data: Partial<BarrenosData>) => void;
  updateTemplado: (data: Partial<TempladoData>) => void;
  updatePulido: (data: Partial<PulidoData>) => void;
  updateSerigrafia: (data: Partial<SerigrafiaData>) => void;
  updateMarca: (data: Partial<MarcaData>) => void;
  updateObservaciones: (data: Partial<ObservacionesData>) => void;
  resetForm: () => void;
}

const DRAFT_STORAGE_KEY = "rhino-origin-wizard-draft";
const STEP_STORAGE_KEY = "rhino-origin-wizard-step";
const HEADER_STORAGE_KEY = "rhino-origin-sheet-info";
export const EDITING_SHEET_KEY = "rhino-origin-editing-sheet";
export const EDITING_ID_KEY = "rhino-origin-editing-id";

export function clearWizardDraft() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(STEP_STORAGE_KEY);
    localStorage.removeItem(HEADER_STORAGE_KEY);
    localStorage.removeItem(EDITING_SHEET_KEY);
    localStorage.removeItem(EDITING_ID_KEY);
  }
}

// Maps a saved OriginSheet back into the shape FormDataContext expects
function mapOriginSheetToFormData(sheet: Record<string, any>) {
  return {
    originSheetInfo: {
      rhinoCode: sheet.InformacionOrigen?.rhinoCode || "",
      descripcion: sheet.InformacionOrigen?.descripcion || "",
      claveExterna: sheet.InformacionOrigen?.claveExterna || "",
    },
    preparacion: {
      espesores: sheet.Preparacion?.espesores || [],
      espesorCustom: sheet.Preparacion?.espesorCustom || "",
      tolerancia: sheet.Preparacion?.tolerancia || "",
      origen: sheet.Preparacion?.origen || "",
      origenCustom: sheet.Preparacion?.origenCustom || "",
    },
    corte: {
      ejeX: sheet.Corte?.ejeX || "",
      ejeY: sheet.Corte?.ejeY || "",
      area: sheet.Corte?.area || "",
    },
    barrenos: {
      aplica: sheet.Barrenos?.aplica ?? false,
      cantidadBarrenos: sheet.Barrenos?.cantidad ?? 0,
      barrenos: (sheet.Barrenos?.barrenos || []).map((b: Record<string, any>) => ({
        x: b.posicionX || "",
        y: b.posicionY || "",
        diametro: b.diametro || "",
      })),
    },
    templado: {
      tipoMolde: sheet.Templado?.tipoMolde || "",
      tipoProceso: sheet.Templado?.tipoProceso || "",
      radioCilindro: sheet.Templado?.radioCilindro || "",
    },
    pulido: {
      metrosLineales: sheet.Pulido?.metrosLineales || "",
      tipoPulido: sheet.Pulido?.tipoPulido || "",
    },
    serigrafia: {
      aplica: sheet.Serigrafia?.aplica ?? false,
      color: sheet.Serigrafia?.color || "",
      defroster_aplica: sheet.Serigrafia?.defroster?.aplica ?? false,
      defroster_area: sheet.Serigrafia?.defroster?.area || "",
    },
    marca: {
      marca: sheet.Marca?.marca || "",
      colorMarca: sheet.Marca?.colorMarca || "Negro",
      numeroMain: sheet.Marca?.numeroMain || "",
      coordenadasMain: sheet.Marca?.coordenadasMain || "",
    },
    observaciones: {
      notas: sheet.Observaciones?.notas || "",
    },
  };
}

const initialFormData: FormData = {
  originSheetInfo: {
    rhinoCode: "",
    descripcion: "",
    claveExterna: "",
  },
  preparacion: {
    espesores: [],
    espesorCustom: "",
    tolerancia: "",
    origen: "",
    origenCustom: "",
  },
  diseno: {
    files: [],
    persistedFiles: [],
    uploadingFiles: [],
  },
  corte: {
    ejeX: "",
    ejeY: "",
    area: "",
  },
  barrenos: {
    aplica: false,
    cantidadBarrenos: 0,
    barrenos: [],
  },
  templado: {
    tipoMolde: "",
    tipoProceso: "",
    radioCilindro: "",
  },
  pulido: {
    metrosLineales: "",
    tipoPulido: "",
  },
  serigrafia: {
    aplica: false,
    color: "",
    defroster_aplica: false,
    defroster_area: "",
  },
  marca: {
    marca: "",
    colorMarca: "Negro", // Default value
    numeroMain: "",
    coordenadasMain: "",
  },
  observaciones: {
    notas: "",
  },
};

const FormDataContext = createContext<FormDataContextType>({
  formData: initialFormData,
  updateOriginSheetInfo: () => {},
  updatePreparacion: () => {},
  updateDiseno: () => {},
  addDisenoFile: () => {},
  removeDisenoFile: () => {},
  setPersistedFiles: () => {},
  addPersistedFile: () => {},
  removePersistedFile: () => {},
  addUploadingFile: () => {},
  updateUploadingFile: () => {},
  removeUploadingFile: () => {},
  updateCorte: () => {},
  updateBarrenos: () => {},
  updateTemplado: () => {},
  updatePulido: () => {},
  updateSerigrafia: () => {},
  updateMarca: () => {},
  updateObservaciones: () => {},
  resetForm: () => {},
});

export function FormDataProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [initialized, setInitialized] = useState(false);

  // Restore from localStorage on mount: editing sheet takes priority over draft
  useEffect(() => {
    try {
      const editing = localStorage.getItem(EDITING_SHEET_KEY);
      if (editing) {
        const sheet = JSON.parse(editing);
        setFormData((prev) => ({ ...prev, ...mapOriginSheetToFormData(sheet) }));
        localStorage.removeItem(EDITING_SHEET_KEY);
      } else {
        const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (saved) {
          const draft = JSON.parse(saved);
          setFormData((prev) => ({
            ...prev,
            ...draft,
            diseno: {
              ...prev.diseno,
              persistedFiles: draft.diseno?.persistedFiles ?? prev.diseno.persistedFiles,
            },
          }));
        }
      }
    } catch {}
    setInitialized(true);
  }, []);

  // Persist draft to localStorage whenever form data changes
  useEffect(() => {
    if (!initialized) return;
    const { originSheetInfo, diseno, ...rest } = formData;
    const draft = { ...rest, diseno: { persistedFiles: diseno.persistedFiles } };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [formData, initialized]);

  const updateOriginSheetInfo = useCallback((data: Partial<OriginSheetInfo>) => {
    setFormData((prev) => ({
      ...prev,
      originSheetInfo: {
        ...prev.originSheetInfo,
        ...data,
      },
    }));
  }, []);

  const updatePreparacion = useCallback((data: Partial<PreparacionData>) => {
    setFormData((prev) => ({
      ...prev,
      preparacion: {
        ...prev.preparacion,
        ...data,
      },
    }));
  }, []);

  const updateDiseno = useCallback((data: Partial<DisenoData>) => {
    setFormData((prev) => ({
      ...prev,
      diseno: {
        ...prev.diseno,
        ...data,
      },
    }));
  }, []);

  const addDisenoFile = useCallback((file: UploadedFile) => {
    setFormData((prev) => ({
      ...prev,
      diseno: {
        ...prev.diseno,
        files: [...prev.diseno.files, file],
      },
    }));
  }, []);

  const removeDisenoFile = useCallback((id: string) => {
    setFormData((prev) => {
      const fileToRemove = prev.diseno.files.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return {
        ...prev,
        diseno: {
          ...prev.diseno,
          files: prev.diseno.files.filter((f) => f.id !== id),
        },
      };
    });
  }, []);

  const setPersistedFiles = useCallback((files: PersistedFile[]) => {
    setFormData((prev) => ({
      ...prev,
      diseno: {
        ...prev.diseno,
        persistedFiles: files,
      },
    }));
  }, []);

  const addPersistedFile = useCallback((file: PersistedFile) => {
    setFormData((prev) => ({
      ...prev,
      diseno: {
        ...prev.diseno,
        persistedFiles: [...prev.diseno.persistedFiles, file],
      },
    }));
  }, []);

  const removePersistedFile = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      diseno: {
        ...prev.diseno,
        persistedFiles: prev.diseno.persistedFiles.filter((f) => f.id !== id),
      },
    }));
  }, []);

  const addUploadingFile = useCallback((file: UploadingFile) => {
    setFormData((prev) => ({
      ...prev,
      diseno: {
        ...prev.diseno,
        uploadingFiles: [...prev.diseno.uploadingFiles, file],
      },
    }));
  }, []);

  const updateUploadingFile = useCallback((id: string, updates: Partial<UploadingFile>) => {
    setFormData((prev) => ({
      ...prev,
      diseno: {
        ...prev.diseno,
        uploadingFiles: prev.diseno.uploadingFiles.map((f) =>
          f.id === id ? { ...f, ...updates } : f
        ),
      },
    }));
  }, []);

  const removeUploadingFile = useCallback((id: string) => {
    setFormData((prev) => {
      const fileToRemove = prev.diseno.uploadingFiles.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return {
        ...prev,
        diseno: {
          ...prev.diseno,
          uploadingFiles: prev.diseno.uploadingFiles.filter((f) => f.id !== id),
        },
      };
    });
  }, []);

  const updatePulido = useCallback((data: Partial<PulidoData>) => {
    setFormData((prev) => ({
      ...prev,
      pulido: {
        ...prev.pulido,
        ...data,
      },
    }));
  }, []);

  const updateCorte = useCallback((data: Partial<CorteData>) => {
    setFormData((prev) => ({
      ...prev,
      corte: {
        ...prev.corte,
        ...data,
      },
    }));
  }, []);

  const updateBarrenos = useCallback((data: Partial<BarrenosData>) => {
    setFormData((prev) => ({
      ...prev,
      barrenos: {
        ...prev.barrenos,
        ...data,
      },
    }));
  }, []);

  const updateTemplado = useCallback((data: Partial<TempladoData>) => {
    setFormData((prev) => ({
      ...prev,
      templado: {
        ...prev.templado,
        ...data,
      },
    }));
  }, []);

  const updateSerigrafia = useCallback((data: Partial<SerigrafiaData>) => {
    setFormData((prev) => ({
      ...prev,
      serigrafia: {
        ...prev.serigrafia,
        ...data,
      },
    }));
  }, []);

  const updateMarca = useCallback((data: Partial<MarcaData>) => {
    setFormData((prev) => ({
      ...prev,
      marca: {
        ...prev.marca,
        ...data,
      },
    }));
  }, []);

  const updateObservaciones = useCallback((data: Partial<ObservacionesData>) => {
    setFormData((prev) => ({
      ...prev,
      observaciones: {
        ...prev.observaciones,
        ...data,
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  return (
    <FormDataContext.Provider
      value={{
        formData,
        updateOriginSheetInfo,
        updatePreparacion,
        updateDiseno,
        addDisenoFile,
        removeDisenoFile,
        setPersistedFiles,
        addPersistedFile,
        removePersistedFile,
        addUploadingFile,
        updateUploadingFile,
        removeUploadingFile,
        updateCorte,
        updateBarrenos,
        updateTemplado,
        updatePulido,
        updateSerigrafia,
        updateMarca,
        updateObservaciones,
        resetForm,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
}

export function useFormData() {
  return useContext(FormDataContext);
}
