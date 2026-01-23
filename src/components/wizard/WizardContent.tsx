"use client";

import { useWizard } from "./WizardContext";
import {
  PreparacionStep,
  DisenoStep,
  CorteStep,
  PulidoStep,
  BarrenosStep,
  LaminadoStep,
  TempladoStep,
  CalidadStep,
} from "../steps";

const stepComponents = [
  PreparacionStep,
  DisenoStep,
  CorteStep,
  PulidoStep,
  BarrenosStep,
  LaminadoStep,
  TempladoStep,
  CalidadStep,
];

export function WizardContent() {
  const { currentStep } = useWizard();

  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div className="transition-all duration-300">
      <CurrentStepComponent />
    </div>
  );
}
