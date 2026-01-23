"use client";

import { useWizard } from "./WizardContext";

export function WizardNavigation() {
  const { prevStep, nextStep, isFirstStep, isLastStep, currentStep, steps } =
    useWizard();

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
      <button
        onClick={prevStep}
        disabled={isFirstStep}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-medium
          transition-all duration-200
          ${
            isFirstStep
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
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

      <span className="text-sm text-gray-500 dark:text-gray-400">
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
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
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
