"use client";

import { useWizard } from "./WizardContext";

export function ProgressBar() {
  const { currentStep, steps, goToStep } = useWizard();

  return (
    <div className="w-full py-6 px-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2 z-0" />

        {/* Progress line filled */}
        <div
          className="absolute left-0 top-1/2 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Step indicators */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              className={`
                relative z-10 flex flex-col items-center group cursor-pointer
                transition-all duration-200 hover:scale-105
              `}
            >
              {/* Circle indicator */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  text-sm font-semibold transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-blue-600 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-200"
                      : "bg-white text-gray-500 border-2 border-gray-300"
                  }
                `}
              >
                {isCompleted ? (
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  mt-2 text-xs font-medium whitespace-nowrap
                  hidden sm:block
                  ${
                    isCurrent
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-blue-600"
                      : "text-gray-500"
                  }
                `}
              >
                {step.label}
              </span>

              {/* Short label for mobile */}
              <span
                className={`
                  mt-2 text-xs font-medium whitespace-nowrap
                  sm:hidden
                  ${
                    isCurrent
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-blue-600"
                      : "text-gray-500"
                  }
                `}
              >
                {step.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
