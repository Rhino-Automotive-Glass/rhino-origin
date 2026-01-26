"use client";

import React from "react";
import { StepContainer } from "./StepContainer";
import { useFormData } from "../wizard";

export function BarrenosStep() {
  const { formData, updateBarrenos } = useFormData();
  const { cantidadBarrenos, tipoBroca, diametro } = formData.barrenos;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    updateBarrenos({ [id]: value });
  };

  return (
    <StepContainer
      title="Barrenos"
      description="Configuración de perforaciones y orificios en el vidrio."
    >
      <div className="space-y-6">
        {/* Cantidad Total de Barrenos Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="cantidadBarrenos"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Cantidad total de Barrenos
          </label>
          <input
            type="number"
            id="cantidadBarrenos"
            value={cantidadBarrenos}
            onChange={handleInputChange}
            min="0"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Ingrese la cantidad de barrenos"
          />
        </div>

        {/* Tipo de Broca Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="tipoBroca"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Tipo de Broca
          </label>
          <input
            type="text"
            id="tipoBroca"
            value={tipoBroca}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Ingrese el tipo de broca"
          />
        </div>

        {/* Diámetro Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="diametro"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Diámetro (mm)
          </label>
          <input
            type="number"
            id="diametro"
            value={diametro}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Ingrese el diámetro de la broca"
          />
        </div>
      </div>
    </StepContainer>
  );
}
