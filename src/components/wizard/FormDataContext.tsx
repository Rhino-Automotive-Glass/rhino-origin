"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Preparacion Step Data
type EspesorOption = "4" | "5" | "6" | "otro";
type OrigenOption = "original" | "plantilla" | "unidad" | "plano" | "otro";

interface PreparacionData {
  espesor: EspesorOption | "";
  espesorCustom: string;
  tolerancia: string;
  origen: OrigenOption | "";
  origenCustom: string;
}

// Diseno Step Data
interface UploadedFile {
  id: string;
  file: File;
  preview: string | null;
  type: "image" | "text";
}

interface DisenoData {
  files: UploadedFile[];
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
type TipoTempladoOption = "Maquila" | "Fábrica" | "";
export type TipoAsociadoOption = "Plano" | "Molde" | "";

interface TempladoData {
  tipoTemplado: TipoTempladoOption;
  tipoAsociado: TipoAsociadoOption;
  curvatura: string;
}

// Serigrafia Step Data
interface SerigrafiaData {
  aplica: boolean;
  color: "negro" | "otro" | "";
  defroster_aplica: boolean;
  defroster_area: string;
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
}

interface FormDataContextType {
  formData: FormData;
  updatePreparacion: (data: Partial<PreparacionData>) => void;
  updateDiseno: (data: Partial<DisenoData>) => void;
  addDisenoFile: (file: UploadedFile) => void;
  removeDisenoFile: (id: string) => void;
  updateCorte: (data: Partial<CorteData>) => void;
  updateBarrenos: (data: Partial<BarrenosData>) => void;
  updateTemplado: (data: Partial<TempladoData>) => void;
  updatePulido: (data: Partial<PulidoData>) => void;
  updateSerigrafia: (data: Partial<SerigrafiaData>) => void;
}

const initialFormData: FormData = {
  preparacion: {
    espesor: "",
    espesorCustom: "",
    tolerancia: "",
    origen: "",
    origenCustom: "",
  },
  diseno: {
    files: [],
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
    tipoTemplado: "",
    tipoAsociado: "",
    curvatura: "",
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
};

const FormDataContext = createContext<FormDataContextType>({
  formData: initialFormData,
  updatePreparacion: () => {},
  updateDiseno: () => {},
  addDisenoFile: () => {},
  removeDisenoFile: () => {},
  updateCorte: () => {},
  updateBarrenos: () => {},
  updateTemplado: () => {},
  updatePulido: () => {},
  updateSerigrafia: () => {},
});

export function FormDataProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updatePreparacion = (data: Partial<PreparacionData>) => {
    setFormData((prev) => ({
      ...prev,
      preparacion: {
        ...prev.preparacion,
        ...data,
      },
    }));
  };

  const updateDiseno = (data: Partial<DisenoData>) => {
    setFormData((prev) => ({
      ...prev,
      diseno: {
        ...prev.diseno,
        ...data,
      },
    }));
  };

  const addDisenoFile = (file: UploadedFile) => {
    setFormData((prev) => ({
      ...prev,
      diseno: {
        ...prev.diseno,
        files: [...prev.diseno.files, file],
      },
    }));
  };

  const removeDisenoFile = (id: string) => {
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
  };

  const updatePulido = (data: Partial<PulidoData>) => {
    setFormData((prev) => ({
      ...prev,
      pulido: {
        ...prev.pulido,
        ...data,
      },
    }));
  };

  const updateCorte = (data: Partial<CorteData>) => {
    setFormData((prev) => ({
      ...prev,
      corte: {
        ...prev.corte,
        ...data,
      },
    }));
  };

  const updateBarrenos = (data: Partial<BarrenosData>) => {
    setFormData((prev) => ({
      ...prev,
      barrenos: {
        ...prev.barrenos,
        ...data,
      },
    }));
  };

  const updateTemplado = (data: Partial<TempladoData>) => {
    setFormData((prev) => ({
      ...prev,
      templado: {
        ...prev.templado,
        ...data,
      },
    }));
  };

  const updateSerigrafia = (data: Partial<SerigrafiaData>) => {
    setFormData((prev) => ({
      ...prev,
      serigrafia: {
        ...prev.serigrafia,
        ...data,
      },
    }));
  };

  return (
    <FormDataContext.Provider
      value={{
        formData,
        updatePreparacion,
        updateDiseno,
        addDisenoFile,
        removeDisenoFile,
        updateCorte,
        updateBarrenos,
        updateTemplado,
        updatePulido,
        updateSerigrafia,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
}

export function useFormData() {
  return useContext(FormDataContext);
}
