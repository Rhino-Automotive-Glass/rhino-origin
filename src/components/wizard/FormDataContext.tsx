"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Preparacion Step Data
type EspesorOption = "4" | "5" | "6" | "otro";
type OrigenOption = "original" | "plantilla" | "otro";

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

// All Form Data
interface FormData {
  preparacion: PreparacionData;
  diseno: DisenoData;
}

interface FormDataContextType {
  formData: FormData;
  updatePreparacion: (data: Partial<PreparacionData>) => void;
  updateDiseno: (data: Partial<DisenoData>) => void;
  addDisenoFile: (file: UploadedFile) => void;
  removeDisenoFile: (id: string) => void;
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
};

const FormDataContext = createContext<FormDataContextType>({
  formData: initialFormData,
  updatePreparacion: () => {},
  updateDiseno: () => {},
  addDisenoFile: () => {},
  removeDisenoFile: () => {},
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

  return (
    <FormDataContext.Provider
      value={{
        formData,
        updatePreparacion,
        updateDiseno,
        addDisenoFile,
        removeDisenoFile,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
}

export function useFormData() {
  return useContext(FormDataContext);
}
