"use client";

import { useState } from "react";
import { StepContainer } from "./StepContainer";

const ESPESOR_OPTIONS = ["4", "5", "6", "otro"] as const;
type EspesorOption = (typeof ESPESOR_OPTIONS)[number];

const ORIGEN_OPTIONS = ["original", "plantilla", "otro"] as const;
type OrigenOption = (typeof ORIGEN_OPTIONS)[number];

export function PreparacionStep() {
  const [espesor, setEspesor] = useState<EspesorOption | "">("");
  const [espesorCustom, setEspesorCustom] = useState<string>("");
  const [tolerancia, setTolerancia] = useState<string>("");
  const [origen, setOrigen] = useState<OrigenOption | "">("");
  const [origenCustom, setOrigenCustom] = useState<string>("");

  const getEspesorDisplayValue = () => {
    if (!espesor) return null;
    if (espesor === "otro") {
      return espesorCustom ? `${espesorCustom}mm` : null;
    }
    return `${espesor}mm`;
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
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Espesor</h3>
            {espesorDisplayValue && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                {espesorDisplayValue}
              </span>
            )}
          </div>

          {/* Radio Button Group */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
              {ESPESOR_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`
                    flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer
                    transition-all duration-200
                    ${
                      espesor === option
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="espesor"
                    value={option}
                    checked={espesor === option}
                    onChange={(e) => setEspesor(e.target.value as EspesorOption)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">
                    {option === "otro" ? "Otro" : `${option}mm`}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom Value Input */}
            {espesor === "otro" && (
              <div className="mt-3 max-w-xs">
                <label
                  htmlFor="espesorCustom"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Valor personalizado (mm)
                </label>
                <input
                  type="number"
                  id="espesorCustom"
                  value={espesorCustom}
                  onChange={(e) => setEspesorCustom(e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ingrese el espesor"
                />
              </div>
            )}
          </div>

          {/* Tolerancia Input */}
          <div className="mt-4 max-w-xs">
            <label
              htmlFor="tolerancia"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tolerancia (mm)
            </label>
            <input
              type="number"
              id="tolerancia"
              value={tolerancia}
              onChange={(e) => setTolerancia(e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej: 0.5"
            />
          </div>
        </div>

        {/* Origen Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Origen</h3>
            {origenDisplayValue && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                {origenDisplayValue}
              </span>
            )}
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
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="origen"
                    value={option}
                    checked={origen === option}
                    onChange={(e) => setOrigen(e.target.value as OrigenOption)}
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
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Especifique el origen
                </label>
                <input
                  type="text"
                  id="origenCustom"
                  value={origenCustom}
                  onChange={(e) => setOrigenCustom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
