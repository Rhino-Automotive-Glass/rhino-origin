"use client";

import { StepContainer } from "./StepContainer";

export function BarrenosStep() {
  return (
    <StepContainer
      title="Barrenos"
      description="Configuración de perforaciones y orificios en el vidrio."
    >
      <div className="flex items-center justify-center h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Formulario de barrenos próximamente
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Ubicación, diámetro, cantidad, tipo de broca, etc.
          </p>
        </div>
      </div>
    </StepContainer>
  );
}
