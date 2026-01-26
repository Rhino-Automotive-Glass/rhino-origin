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

// Pulido Step Data
const TIPO_PULIDO_OPTIONS = ["2 Pits", "4", "Mixto"] as const;
type TipoPulidoOption = (typeof TIPO_PULIDO_OPTIONS)[number];

interface PulidoData {
  metrosLineales: string;
  tipoPulido: TipoPulidoOption | "";
}

// All Form Data
interface FormData {
  preparacion: PreparacionData;
  diseno: DisenoData;
  pulido: PulidoData;
}

interface FormDataContextType {
  formData: FormData;
  updatePreparacion: (data: Partial<PreparacionData>) => void;
  updateDiseno: (data: Partial<DisenoData>) => void;
  addDisenoFile: (file: UploadedFile) => void;
  removeDisenoFile: (id: string) => void;
  updatePulido: (data: Partial<PulidoData>) => void;
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
  pulido: {
    metrosLineales: "",
    tipoPulido: "",
  },
};

const FormDataContext = createContext<FormDataContextType>({
  formData: initialFormData,
  updatePreparacion: () => {},
  updateDiseno: () => {},
  addDisenoFile: () => {},
  removeDisenoFile: () => {},
  updatePulido: () => {},
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

  return (
    <FormDataContext.Provider
      value={{
        formData,
        updatePreparacion,
        updateDiseno,
        addDisenoFile,
        removeDisenoFile,
        updatePulido,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
}

export function useFormData() {
  return useContext(FormDataContext);
}
