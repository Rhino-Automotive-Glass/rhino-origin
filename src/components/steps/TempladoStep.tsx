"use client";

import React, { useEffect, useMemo } from "react";
import { StepContainer } from "./StepContainer";
import { useFormData } from "../wizard";

const TIPO_MOLDE_OPTIONS = ["Plano", "Cilíndrico", "Esférico", "Cónico"] as const;
const TIPO_PROCESO_OPTIONS = ["Maquila", "Fábrica"] as const;

export function TempladoStep() {
  const { formData, updateTemplado } = useFormData();
  const { tipoMolde, tipoProceso, radioCilindro } = formData.templado;

  const handleTipoMoldeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTipoMolde = e.target.value as (typeof TIPO_MOLDE_OPTIONS)[number];

    const updates: Partial<typeof formData.templado> = { tipoMolde: newTipoMolde };

    // Logic for dependent fields
    if (newTipoMolde === "Esférico" || newTipoMolde === "Cónico") {
      updates.tipoProceso = "Fábrica";
    }
    if (newTipoMolde !== "Cilíndrico") {
      updates.radioCilindro = "";
    }
    
    updateTemplado(updates);
  };

  const availableProcesoOptions = useMemo(() => {
    if (tipoMolde === "Esférico" || tipoMolde === "Cónico") {
      return ["Fábrica"];
    }
    return TIPO_PROCESO_OPTIONS;
  }, [tipoMolde]);

  return (
    <StepContainer
      title="Templado"
      description="Parámetros del proceso de templado térmico del vidrio."
    >
      <div className="space-y-6">
        {/* Tipo de Molde Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="tipoMolde"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Tipo de Molde
          </label>
          <select
            id="tipoMolde"
            value={tipoMolde}
            onChange={handleTipoMoldeChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">Seleccione el tipo de molde</option>
            {TIPO_MOLDE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Proceso Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="tipoProceso"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Tipo de Proceso
          </label>
          <select
            id="tipoProceso"
            value={tipoProceso}
            onChange={(e) => updateTemplado({ tipoProceso: e.target.value as (typeof TIPO_PROCESO_OPTIONS)[number] })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            disabled={availableProcesoOptions.length === 1 && availableProcesoOptions[0] === 'Fábrica'}
          >
            <option value="">Seleccione el tipo de proceso</option>
            {availableProcesoOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Radio del cilindro Section */}
        {tipoMolde === "Cilíndrico" && (
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <label
              htmlFor="radioCilindro"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Radio del cilindro (mm)
            </label>
            <input
              type="number"
              id="radioCilindro"
              value={radioCilindro}
              onChange={(e) => updateTemplado({ radioCilindro: e.target.value })}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ingrese el radio"
            />
          </div>
        )}
      </div>
    </StepContainer>
  );
}
