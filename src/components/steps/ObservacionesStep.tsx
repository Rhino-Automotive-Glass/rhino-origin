"use client";

import { useFormData } from "../wizard/FormDataContext";
import { StepContainer } from "./StepContainer";

export function ObservacionesStep() {
  const { formData, updateObservaciones } = useFormData();

  return (
    <StepContainer
      title="Observaciones"
      description="Agrega notas u observaciones relevantes sobre la hoja de origen."
    >
      <div className="w-full">
        <label
          htmlFor="observaciones-notas"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Notas
        </label>
        <textarea
          id="observaciones-notas"
          value={formData.observaciones.notas}
          onChange={(e) => updateObservaciones({ notas: e.target.value })}
          placeholder="Escribe tus observaciones aquí..."
          rows={8}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors duration-200"
        />
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          {formData.observaciones.notas.length} caracteres
        </p>
      </div>
    </StepContainer>
  );
}
