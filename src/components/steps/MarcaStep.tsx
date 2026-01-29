"use client";

import { StepContainer } from "./StepContainer";
import { useFormData } from "../wizard/FormDataContext";

export function MarcaStep() {
  const { formData, updateMarca } = useFormData();
  const { marca, colorMarca, numeroMain, coordenadasMain } = formData.marca;

  return (
    <StepContainer
      title="Marca"
      description="Configuración de la identidad visual, sellos y referencias de ubicación del Main en la pieza."
    >
      <div className="space-y-4">
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="marca"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Marca
          </label>
          <input
            type="text"
            id="marca"
            name="marca"
            value={marca}
            onChange={(e) => updateMarca({ marca: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Agregue el nombre de la marca"
          />
        </div>
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="color-marca"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Color de Marca
          </label>
          <select
            id="color-marca"
            name="color-marca"
            value={colorMarca}
            onChange={(e) => updateMarca({ colorMarca: e.target.value })}
            className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option>Negro</option>
            <option>Otro</option>
          </select>
        </div>
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="numero-main"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Número de Main
          </label>
          <input
            type="text"
            id="numero-main"
            name="numero-main"
            value={numeroMain}
            onChange={(e) => updateMarca({ numeroMain: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Ingrese el número de main"
          />
        </div>
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <label
            htmlFor="coordenadas-main"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Coordenadas del Main
          </label>
          <input
            type="text"
            id="coordenadas-main"
            name="coordenadas-main"
            value={coordenadasMain}
            onChange={(e) => updateMarca({ coordenadasMain: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Ej: X:100, Y:200"
          />
        </div>
      </div>
    </StepContainer>
  );
}
