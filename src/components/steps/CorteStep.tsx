"use client";

import { StepContainer } from "./StepContainer";

export function CorteStep() {
  return (
    <StepContainer
      title="Corte"
      description="Parámetros y especificaciones para el proceso de corte del vidrio."
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
              d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
            />
          </svg>
          <p className="mt-2 text-gray-500">Formulario de corte próximamente</p>
          <p className="text-sm text-gray-400">
            Tipo de corte, velocidad, presión, herramientas, etc.
          </p>
        </div>
      </div>
    </StepContainer>
  );
}
