"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
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

// All Form Data
interface FormData {
  preparacion: PreparacionData;
  diseno: DisenoData;
  corte: CorteData;
  barrenos: BarrenosData;
  templado: TempladoData;
  pulido: PulidoData;
  serigrafia: SerigrafiaData;
  marca: MarcaData;
}

interface FormDataContextType {
  formData: FormData;
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
}

const initialFormData: FormData = {
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
};

const FormDataContext = createContext<FormDataContextType>({
  formData: initialFormData,
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
});

export function FormDataProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

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

  return (
    <FormDataContext.Provider
      value={{
        formData,
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
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
}

export function useFormData() {
  return useContext(FormDataContext);
}
