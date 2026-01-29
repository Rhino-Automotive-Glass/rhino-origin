"use client";

import { useState } from "react";
import { StepContainer } from "./StepContainer";
import { useFormData } from "../wizard/FormDataContext";

export function SerigrafiaStep() {
  const { formData, updateSerigrafia } = useFormData();

  const handleSerigrafiaChange = (newAplicaState: boolean) => {
    updateSerigrafia({ aplica: newAplicaState });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSerigrafia({ color: e.target.value as "negro" | "otro" });
  };

  const handleDefrosterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const aplica = e.target.value === "aplica";
    updateSerigrafia({ defroster_aplica: aplica });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSerigrafia({ defroster_area: e.target.value });
  };

  return (
    <StepContainer
      title="Serigrafía"
      description="Registro de acabados estéticos y especificaciones del área térmica."
    >
      <div className="space-y-4">
        <fieldset className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
            Aplicación de Serigrafía
          </legend>
          <div className="flex items-center justify-around mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="serigrafia-aplica"
                checked={formData.serigrafia.aplica}
                onChange={() => handleSerigrafiaChange(true)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="serigrafia-aplica"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Aplica
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="serigrafia-no-aplica"
                checked={!formData.serigrafia.aplica}
                onChange={() => handleSerigrafiaChange(false)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="serigrafia-no-aplica"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                No Aplica
              </label>
            </div>
          </div>
        </fieldset>

        {formData.serigrafia.aplica && (
          <div>
            <label
              htmlFor="color-serigrafia"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Color
            </label>
            <select
              id="color-serigrafia"
              name="color-serigrafia"
              onChange={handleColorChange}
              value={formData.serigrafia.color || ""}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="negro">Negro</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        )}


        <div>
          <label
            htmlFor="defroster"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Defroster (Área Térmica)
          </label>
          <select
            id="defroster"
            name="defroster"
            onChange={handleDefrosterChange}
            value={formData.serigrafia.defroster_aplica ? "aplica" : "no-aplica"}
            className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="aplica">Aplica</option>
            <option value="no-aplica">No aplica</option>
          </select>
        </div>

        {formData.serigrafia.defroster_aplica && (
          <div>
            <label
              htmlFor="defroster-area"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Área total en m²
            </label>
            <input
              type="number"
              id="defroster-area"
              name="defroster-area"
              onChange={handleAreaChange}
              value={formData.serigrafia.defroster_area || ""}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        )}
      </div>
    </StepContainer>
  );
}
