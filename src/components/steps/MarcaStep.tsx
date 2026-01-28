"use client";

import { StepContainer } from "./StepContainer";

export function MarcaStep() {
  return (
    <StepContainer
      title="Marca"
      description="Configuración de la identidad visual, sellos y referencias de ubicación del Main en la pieza."
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="marca"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Marca
          </label>
          <input
            type="text"
            id="marca"
            name="marca"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="color-marca"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Color de Marca
          </label>
          <select
            id="color-marca"
            name="color-marca"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800"
          >
            <option>Negro</option>
            <option>Otro</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="numero-main"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Número de Main
          </label>
          <input
            type="text"
            id="numero-main"
            name="numero-main"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="coordenadas-main"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Coordenadas del Main
          </label>
          <input
            type="text"
            id="coordenadas-main"
            name="coordenadas-main"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </StepContainer>
  );
}
