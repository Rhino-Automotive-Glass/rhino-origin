"use client";

import React, { useEffect } from "react";
import { StepContainer } from "./StepContainer";
import { useFormData, TipoAsociadoOption } from "../wizard";

const TIPO_TEMPLADO_OPTIONS = ["Maquila", "Fábrica"] as const;
type TipoTempladoOption = (typeof TIPO_TEMPLADO_OPTIONS)[number];

export function TempladoStep() {
  const { formData, updateTemplado } = useFormData();
  const { tipoTemplado, tipoAsociado, curvatura } = formData.templado;

  useEffect(() => {
    let newTipoAsociado: TipoAsociadoOption = "";
    if (tipoTemplado === "Maquila") {
      newTipoAsociado = "Plano";
    } else if (tipoTemplado === "Fábrica") {
      newTipoAsociado = "Molde";
    }
    if (newTipoAsociado !== tipoAsociado) {
      updateTemplado({ tipoAsociado: newTipoAsociado });
    }
  }, [tipoTemplado, tipoAsociado, updateTemplado]);

  const handleTipoTempladoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTemplado({ tipoTemplado: e.target.value as TipoTempladoOption });
  };

  const handleCurvaturaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTemplado({ curvatura: e.target.value });
  };

  return (
    <StepContainer
      title="Templado"
      description="Parámetros del proceso de templado térmico del vidrio."
    >
      <div className="space-y-6">
        {/* Tipo de Templado Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="tipoTemplado"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Tipo de Templado
          </label>
          <select
            id="tipoTemplado"
            value={tipoTemplado}
            onChange={handleTipoTempladoChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">Seleccione el tipo</option>
            {TIPO_TEMPLADO_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo Asociado Section (Read-only) */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="tipoAsociado"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Tipo Asociado
          </label>
          <input
            type="text"
            id="tipoAsociado"
            value={tipoAsociado}
            readOnly
            className="w-full px-3 py-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            placeholder="Se asociará automáticamente"
          />
        </div>

        {/* Curvatura Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="curvatura"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Curvatura (mm)
          </label>
          <input
            type="number"
            id="curvatura"
            value={curvatura}
            onChange={handleCurvaturaChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Ingrese la curvatura"
          />
        </div>
      </div>
    </StepContainer>
  );
}
