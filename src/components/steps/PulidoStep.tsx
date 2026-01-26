"use client";

import { StepContainer } from "./StepContainer";
import { useFormData } from "../wizard";

const TIPO_PULIDO_OPTIONS = ["2 Pits", "4", "Mixto"] as const;
type TipoPulidoOption = (typeof TIPO_PULIDO_OPTIONS)[number];

export function PulidoStep() {
  const { formData, updatePulido } = useFormData();
  const { metrosLineales, tipoPulido } = formData.pulido;

  return (
    <StepContainer
      title="Pulido"
      description="Especificaciones del proceso de pulido y acabado de bordes."
    >
      <div className="space-y-6">
        {/* Metros Lineales Pulidos Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="metrosLineales"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Metros lineales pulidos
          </label>
          <input
            type="number"
            id="metrosLineales"
            value={metrosLineales}
            onChange={(e) => updatePulido({ metrosLineales: e.target.value })}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Ingrese los metros lineales"
          />
        </div>

        {/* Tipo de Pulido Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tipo de Pulido (Estándar SAE)</h3>
            {tipoPulido && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-orange-500/50 text-blue-700 dark:text-white text-sm font-medium rounded">
                {tipoPulido}
              </span>
            )}
          </div>

          {/* Radio Button Group */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
              {TIPO_PULIDO_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`
                    flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer
                    transition-all duration-200
                    ${
                      tipoPulido === option
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="tipoPulido"
                    value={option}
                    checked={tipoPulido === option}
                    onChange={(e) => updatePulido({ tipoPulido: e.target.value as TipoPulidoOption })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StepContainer>
  );
}