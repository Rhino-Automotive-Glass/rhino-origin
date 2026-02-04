"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";

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
  { id: "marca", label: "Marca", shortLabel: "Mar" },
  { id: "serigrafia", label: "Serigrafía", shortLabel: "Serig" },
  { id: "templado", label: "Templado", shortLabel: "Temp" },
  { id: "observaciones", label: "Observaciones", shortLabel: "Obs" },
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

const STEP_STORAGE_KEY = "rhino-origin-wizard-step";

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const stepLoadedRef = useRef(false);

  // Restore step from localStorage on mount, then persist on every change
  useEffect(() => {
    if (!stepLoadedRef.current) {
      stepLoadedRef.current = true;
      const saved = localStorage.getItem(STEP_STORAGE_KEY);
      if (saved !== null) {
        const step = parseInt(saved, 10);
        if (!isNaN(step) && step >= 0 && step < WIZARD_STEPS.length) {
          setCurrentStep(step);
        }
      }
      return; // skip saving on this tick — we just loaded
    }
    localStorage.setItem(STEP_STORAGE_KEY, String(currentStep));
  }, [currentStep]);

  const goToStep = (step: number) => {
    if (step >= 0 && step < WIZARD_STEPS.length) {
      setCurrentStep(step);
    }
  };

  const nextStep = useCallback(() => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isInputFocused) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevStep();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevStep, nextStep]);

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
