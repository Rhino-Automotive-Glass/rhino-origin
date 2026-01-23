"use client";

import { StepContainer } from "./StepContainer";

export function LaminadoStep() {
  return (
    <StepContainer
      title="Laminado"
      description="Especificaciones del proceso de laminado y capas del vidrio."
    >
      <div className="flex items-center justify-center h-[300px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="mt-2 text-gray-500">
            Formulario de laminado próximamente
          </p>
          <p className="text-sm text-gray-400">
            Tipo de PVB, temperatura, presión, capas, etc.
          </p>
        </div>
      </div>
    </StepContainer>
  );
}
