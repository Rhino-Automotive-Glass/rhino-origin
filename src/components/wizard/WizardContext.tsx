"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Step {
  id: string;
  label: string;
  shortLabel: string;
}

export const WIZARD_STEPS: Step[] = [
  { id: "preparacion", label: "Preparación", shortLabel: "Prep" },
  { id: "diseno", label: "Diseño", shortLabel: "Diseño" },
  { id: "corte", label: "Corte", shortLabel: "Corte" },
  { id: "pulido", label: "Pulido", shortLabel: "Pulido" },
  { id: "barrenos", label: "Barrenos", shortLabel: "Barr" },
  { id: "laminado", label: "Laminado", shortLabel: "Lam" },
  { id: "templado", label: "Templado", shortLabel: "Temp" },
  { id: "calidad", label: "Calidad", shortLabel: "QA" },
];

interface WizardContextType {
  currentStep: number;
  steps: Step[];
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);

  const goToStep = (step: number) => {
    if (step >= 0 && step < WIZARD_STEPS.length) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        steps: WIZARD_STEPS,
        goToStep,
        nextStep,
        prevStep,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === WIZARD_STEPS.length - 1,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
