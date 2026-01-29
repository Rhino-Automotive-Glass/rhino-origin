"use client";

import { StepContainer } from "./StepContainer";
import { useFormData } from "../wizard";

const ESPESOR_OPTIONS = ["4", "5", "6", "otro"] as const;
type EspesorOption = (typeof ESPESOR_OPTIONS)[number];

const ORIGEN_OPTIONS = ["original", "plantilla", "unidad", "plano", "otro"] as const;
type OrigenOption = (typeof ORIGEN_OPTIONS)[number];

export function PreparacionStep() {
  const { formData, updatePreparacion } = useFormData();
  const { espesores, espesorCustom, tolerancia, origen, origenCustom } = formData.preparacion;

  const handleEspesorChange = (option: EspesorOption) => {
    const newEspesores = espesores.includes(option)
      ? espesores.filter((item) => item !== option)
      : [...espesores, option];

    const updates: Partial<typeof formData.preparacion> = { espesores: newEspesores };
    if (!newEspesores.includes("otro")) {
      updates.espesorCustom = "";
    }
    updatePreparacion(updates);
  };
  
  const getEspesorDisplayValue = () => {
    if (espesores.length === 0) return null;
    return espesores.map(e => {
      if (e === 'otro') {
        return espesorCustom ? `${espesorCustom}mm (Otro)` : 'Otro';
      }
      return `${e}mm`;
    }).join(', ');
  };

  const getOrigenDisplayValue = () => {
    if (!origen) return null;
    if (origen === "otro") {
      return origenCustom || null;
    }
    return origen.charAt(0).toUpperCase() + origen.slice(1);
  };

  const espesorDisplayValue = getEspesorDisplayValue();
  const origenDisplayValue = getOrigenDisplayValue();

  return (
    <StepContainer
      title="Preparación"
      description="Configuración inicial y especificaciones de materiales para la orden de vidrio automotriz."
    >
      <div className="space-y-6">
        {/* Espesor Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Espesor</h3>
          </div>

          {/* Checkbox Group */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
              {ESPESOR_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`
                    flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer
                    transition-all duration-200
                    ${
                      espesores.includes(option)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    name="espesor"
                    value={option}
                    checked={espesores.includes(option)}
                    onChange={() => handleEspesorChange(option)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">
                    {option === "otro" ? "Otro" : `${option}mm`}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom Value Input */}
            {espesores.includes("otro") && (
              <div className="mt-3 max-w-xs">
                <label
                  htmlFor="espesorCustom"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Valor personalizado (mm)
                </label>
                <input
                  type="number"
                  id="espesorCustom"
                  value={espesorCustom}
                  onChange={(e) => updatePreparacion({ espesorCustom: e.target.value })}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ingrese el espesor"
                />
              </div>
            )}
          </div>

          {/* Tolerancia Input */}
          <div className="mt-4 max-w-xs">
            <label
              htmlFor="tolerancia"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tolerancia (mm)
            </label>
            <input
              type="number"
              id="tolerancia"
              value={tolerancia}
              onChange={(e) => updatePreparacion({ tolerancia: e.target.value })}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej: 0.5"
            />
          </div>
        </div>

        {/* Origen Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Origen</h3>
          </div>

          {/* Radio Button Group */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
              {ORIGEN_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`
                    flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer
                    transition-all duration-200
                    ${
                      origen === option
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="origen"
                    value={option}
                    checked={origen === option}
                    onChange={(e) => updatePreparacion({ origen: e.target.value as OrigenOption })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom Value Input */}
            {origen === "otro" && (
              <div className="mt-3 max-w-xs">
                <label
                  htmlFor="origenCustom"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Especifique el origen
                </label>
                <input
                  type="text"
                  id="origenCustom"
                  value={origenCustom}
                  onChange={(e) => updatePreparacion({ origenCustom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ingrese el origen"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </StepContainer>
  );
}
