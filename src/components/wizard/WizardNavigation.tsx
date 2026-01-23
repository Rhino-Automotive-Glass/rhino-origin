"use client";

import { useWizard } from "./WizardContext";

export function WizardNavigation() {
  const { prevStep, nextStep, isFirstStep, isLastStep, currentStep, steps } =
    useWizard();

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
      <button
        onClick={prevStep}
        disabled={isFirstStep}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-medium
          transition-all duration-200
          ${
            isFirstStep
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
        `}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Anterior
      </button>

      <span className="text-sm text-gray-500">
        Paso {currentStep + 1} de {steps.length}
      </span>

      <button
        onClick={nextStep}
        disabled={isLastStep}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-medium
          transition-all duration-200
          ${
            isLastStep
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }
        `}
      >
        {isLastStep ? "Finalizar" : "Siguiente"}
        {!isLastStep && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
