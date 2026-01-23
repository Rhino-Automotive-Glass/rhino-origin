"use client";

import { StepContainer } from "./StepContainer";

export function PulidoStep() {
  return (
    <StepContainer
      title="Pulido"
      description="Especificaciones del proceso de pulido y acabado de bordes."
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
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <p className="mt-2 text-gray-500">Formulario de pulido próximamente</p>
          <p className="text-sm text-gray-400">
            Granulometría, pasadas, acabado final, etc.
          </p>
        </div>
      </div>
    </StepContainer>
  );
}
