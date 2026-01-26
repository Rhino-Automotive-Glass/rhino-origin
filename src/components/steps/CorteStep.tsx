"use client";

import React, { useEffect } from "react";
import { StepContainer } from "./StepContainer";
import { useFormData } from "../wizard";

export function CorteStep() {
  const { formData, updateCorte } = useFormData();
  const { ejeX, ejeY, area } = formData.corte;

  useEffect(() => {
    const x = parseFloat(ejeX) || 0;
    const y = parseFloat(ejeY) || 0;
    const calculatedArea = (x * y) / 1000000; // Assuming input is in millimeters
    updateCorte({ area: calculatedArea.toFixed(4) });
  }, [ejeX, ejeY]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    updateCorte({ [id]: value });
  };

  return (
    <StepContainer
      title="Corte"
      description="Parámetros y especificaciones para el proceso de corte del vidrio."
    >
      <div className="space-y-6">
        {/* Ejes X e Y Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <label
              htmlFor="ejeX"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Eje X (mm)
            </label>
            <input
              type="number"
              id="ejeX"
              value={ejeX}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ingrese la medida del eje X"
            />
          </div>
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <label
              htmlFor="ejeY"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Eje Y (mm)
            </label>
            <input
              type="number"
              id="ejeY"
              value={ejeY}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ingrese la medida del eje Y"
            />
          </div>
        </div>

        {/* Área Calculada Section */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="area"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Área (m²)
          </label>
          <input
            type="text"
            id="area"
            value={area}
            readOnly
            className="w-full px-3 py-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            placeholder="El área se calculará automáticamente"
          />
        </div>
      </div>
    </StepContainer>
  );
}