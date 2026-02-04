"use client";

import { useWizard } from "./WizardContext";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  PreparacionStep,
  DisenoStep,
  CorteStep,
  PulidoStep,
  BarrenosStep,
  MarcaStep,
  SerigrafiaStep,
  TempladoStep,
  ObservacionesStep,
} from "../steps";

const stepComponents = [
  PreparacionStep,
  DisenoStep,
  CorteStep,
  PulidoStep,
  BarrenosStep,
  MarcaStep,
  SerigrafiaStep,
  TempladoStep,
  ObservacionesStep,
];

export function WizardContent() {
  const { currentStep, steps, goToStep } = useWizard();
  const [enteringSteps, setEnteringSteps] = useState<Set<number>>(new Set());
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const prevStepRef = useRef(currentStep);
  const prevVisibleStepsRef = useRef<number[]>([]);

  // Calculate which 3 steps to show (sliding window)
  const visibleStepIndices = useMemo(() => {
    const totalSteps = steps.length;

    if (currentStep === 0) {
      return [0, 1, 2];
    } else if (currentStep >= totalSteps - 1) {
      return [totalSteps - 3, totalSteps - 2, totalSteps - 1];
    } else {
      return [currentStep - 1, currentStep, currentStep + 1];
    }
  }, [currentStep, steps.length]);

  useEffect(() => {
    // Determine slide direction based on navigation
    if (currentStep > prevStepRef.current) {
      setSlideDirection("left");
    } else if (currentStep < prevStepRef.current) {
      setSlideDirection("right");
    }

    // Find newly entering steps
    const newEntering = new Set<number>();
    visibleStepIndices.forEach((stepIndex) => {
      if (!prevVisibleStepsRef.current.includes(stepIndex)) {
        newEntering.add(stepIndex);
      }
    });

    if (newEntering.size > 0) {
      setEnteringSteps(newEntering);

      // Clear entering state after animation completes
      const timer = setTimeout(() => {
        setEnteringSteps(new Set());
      }, 1050);

      // Update refs
      prevStepRef.current = currentStep;
      prevVisibleStepsRef.current = visibleStepIndices;

      return () => clearTimeout(timer);
    }

    // Update refs
    prevStepRef.current = currentStep;
    prevVisibleStepsRef.current = visibleStepIndices;
  }, [currentStep, visibleStepIndices]);

  const getAnimationClass = (stepIndex: number) => {
    if (enteringSteps.has(stepIndex)) {
      return slideDirection === "left"
        ? "animate-slide-in-right"
        : "animate-slide-in-left";
    }
    return "";
  };

  return (
    <>
      <style jsx global>{`
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(150px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-150px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .animate-slide-in-right {
          animation: slideInFromRight 1.05s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-slide-in-left {
          animation: slideInFromLeft 1.05s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        {visibleStepIndices.map((stepIndex) => {
          const StepComponent = stepComponents[stepIndex];
          const step = steps[stepIndex];
          const isActive = stepIndex === currentStep;
          const animationClass = getAnimationClass(stepIndex);

          const isEntering = enteringSteps.has(stepIndex);

          return (
            <div
              key={step.id}
              onClick={() => goToStep(stepIndex)}
              className={`
                relative cursor-pointer rounded-xl h-full
                ${isActive ? "block" : "hidden lg:block"}
                ${isEntering ? "" : "transition-all duration-500 ease-out"}
                ${animationClass}
                ${
                  isActive
                    ? "ring-2 ring-blue-500 shadow-lg lg:scale-[1.02]"
                    : isEntering
                      ? ""
                      : "opacity-60 hover:opacity-80 hover:shadow-md"
                }
              `}
            >
              {/* Step indicator badge */}
              <div
                className={`
                  absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-semibold z-10
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                  }
                `}
              >
                Paso {stepIndex + 1}: {step.label}
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}

              <div className={`h-full ${isActive ? "" : "pointer-events-none"}`}>
                <StepComponent />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
