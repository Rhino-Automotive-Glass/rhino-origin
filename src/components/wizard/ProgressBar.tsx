"use client";

import { useWizard } from "./WizardContext";

export function ProgressBar() {
  const { currentStep, steps, goToStep } = useWizard();

  return (
    <div className="w-full py-6 px-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 right-0 top-[25px] h-1 bg-gray-200 dark:bg-gray-600 z-0" />

        {/* Progress line filled */}
        <div
          className="absolute left-0 top-[25px] h-1 bg-blue-600 z-0 transition-all duration-300"
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
                  w-[50px] h-[50px] rounded-full flex items-center justify-center
                  text-base font-bold transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-blue-600 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-400/30"
                      : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-500"
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
                  mt-2 text-xs font-bold whitespace-nowrap
                  hidden sm:block
                  ${
                    isCurrent
                      ? "text-blue-600 dark:text-blue-400"
                      : isCompleted
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
                `}
              >
                {step.label}
              </span>

              {/* Short label for mobile */}
              <span
                className={`
                  mt-2 text-xs font-bold whitespace-nowrap
                  sm:hidden
                  ${
                    isCurrent
                      ? "text-blue-600 dark:text-blue-400"
                      : isCompleted
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
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
