"use client";

import React from "react";
import { StepContainer } from "./StepContainer";
import { useFormData } from "../wizard";

export function BarrenosStep() {
  const { formData, updateBarrenos } = useFormData();
  const { aplica, cantidadBarrenos, barrenos } = formData.barrenos;

  const handleAplicaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (!isChecked) {
      updateBarrenos({
        aplica: isChecked,
        cantidadBarrenos: 0,
        barrenos: [],
      });
    } else {
      updateBarrenos({ aplica: isChecked });
    }
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cantidad = parseInt(e.target.value, 10);
    const newCantidad = cantidad > 12 ? 12 : cantidad;

    const newBarrenos = Array.from({ length: newCantidad }, (_, i) => ({
      x: barrenos[i]?.x || "",
      y: barrenos[i]?.y || "",
      diametro: barrenos[i]?.diametro || "",
    }));

    updateBarrenos({
      cantidadBarrenos: newCantidad,
      barrenos: newBarrenos,
    });
  };

  const handleBarrenoChange = (
    index: number,
    field: "x" | "y" | "diametro",
    value: string
  ) => {
    const newBarrenos = [...barrenos];
    newBarrenos[index] = {
      ...newBarrenos[index],
      [field]: value,
    };
    updateBarrenos({ barrenos: newBarrenos });
  };

  return (
    <StepContainer
      title="Barrenos"
      description="Configuración de perforaciones y orificios en el vidrio."
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <input
            type="checkbox"
            id="aplica"
            checked={aplica}
            onChange={handleAplicaChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="aplica"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Aplica
          </label>
        </div>

        {aplica && (
          <div className="space-y-6">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <label
                htmlFor="cantidadBarrenos"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Cantidad total de Barrenos (Máx. 12)
              </label>
              <input
                type="number"
                id="cantidadBarrenos"
                value={cantidadBarrenos}
                onChange={handleCantidadChange}
                min="0"
                max="12"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Ingrese la cantidad de barrenos"
              />
            </div>

            {Array.from({ length: cantidadBarrenos }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Barreno {index + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor={`x-${index}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Posición X
                    </label>
                    <input
                      type="text"
                      id={`x-${index}`}
                      value={barrenos[index]?.x || ""}
                      onChange={(e) =>
                        handleBarrenoChange(index, "x", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Coord. X"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`y-${index}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Posición Y
                    </label>
                    <input
                      type="text"
                      id={`y-${index}`}
                      value={barrenos[index]?.y || ""}
                      onChange={(e) =>
                        handleBarrenoChange(index, "y", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Coord. Y"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`diametro-${index}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Diámetro (mm)
                    </label>
                    <input
                      type="number"
                      id={`diametro-${index}`}
                      value={barrenos[index]?.diametro || ""}
                      onChange={(e) =>
                        handleBarrenoChange(index, "diametro", e.target.value)
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Diámetro"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StepContainer>
  );
}