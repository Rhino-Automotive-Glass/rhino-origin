"use client";

import { StepContainer } from "./StepContainer";

export function DisenoStep() {
  return (
    <StepContainer
      title="Diseño"
      description="Especificaciones de diseño y geometría del vidrio automotriz."
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
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          <p className="mt-2 text-gray-500">Formulario de diseño próximamente</p>
          <p className="text-sm text-gray-400">
            Curvaturas, ángulos, plantillas CAD, etc.
          </p>
        </div>
      </div>
    </StepContainer>
  );
}
