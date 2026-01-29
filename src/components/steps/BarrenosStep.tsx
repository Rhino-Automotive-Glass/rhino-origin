"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { StepContainer } from "./StepContainer";
import { useFormData } from "../wizard";

interface Barreno {
  x: string;
  y: string;
  diametro: string;
}

export function BarrenosStep() {
  const { formData, updateBarrenos } = useFormData();
  const { aplica, cantidadBarrenos, barrenos } = formData.barrenos;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [tempBarrenos, setTempBarrenos] = useState<Barreno[]>([]);
  const [hasBeenEdited, setHasBeenEdited] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  const handleAplicaChange = (newAplicaState: boolean) => {
    if (!newAplicaState) {
      updateBarrenos({
        aplica: false,
        cantidadBarrenos: 0,
        barrenos: [],
      });
    } else {
      updateBarrenos({ aplica: true });
    }
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    const cantidad = isNaN(parsed) ? 0 : parsed;
    const newCantidad = Math.min(Math.max(cantidad, 0), 12);

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

  const openEditModal = () => {
    setTempBarrenos(
      Array.from({ length: cantidadBarrenos }, (_, i) => ({
        x: barrenos[i]?.x || "",
        y: barrenos[i]?.y || "",
        diametro: barrenos[i]?.diametro || "",
      }))
    );
    setIsEditModalOpen(true);
  };

  const openViewModal = () => {
    setIsViewModalOpen(true);
  };

  const handleTempBarrenoChange = (
    index: number,
    field: "x" | "y" | "diametro",
    value: string
  ) => {
    const newTempBarrenos = [...tempBarrenos];
    newTempBarrenos[index] = {
      ...newTempBarrenos[index],
      [field]: value,
    };
    setTempBarrenos(newTempBarrenos);
  };

  const handleSave = () => {
    updateBarrenos({ barrenos: tempBarrenos });
    setIsEditModalOpen(false);
    setHasBeenEdited(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleCloseView = () => {
    setIsViewModalOpen(false);
  };

  const hasBarrenoData = (barreno: Barreno) => {
    return barreno.x || barreno.y || barreno.diametro;
  };

  return (
    <StepContainer
      title="Barrenos"
      description="Configuración de perforaciones y orificios en el vidrio."
    >
      <div className="space-y-6">
        <fieldset className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
            Aplicación de Barrenos
          </legend>
          <div className="flex items-center justify-around mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="aplica-si"
                name="aplicaBarrenos"
                checked={aplica}
                onChange={() => handleAplicaChange(true)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="aplica-si"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Aplica
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="aplica-no"
                name="aplicaBarrenos"
                checked={!aplica}
                onChange={() => handleAplicaChange(false)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="aplica-no"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                No Aplica
              </label>
            </div>
          </div>
        </fieldset>


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

            {cantidadBarrenos > 0 && (
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={openEditModal}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                  >
                    {hasBeenEdited || barrenos.some(hasBarrenoData) ? "Editar Barrenos" : "Elegir Barrenos"}
                  </button>
                  {barrenos.some(hasBarrenoData) && (
                    <button
                      type="button"
                      onClick={openViewModal}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                    >
                      Visualizar Barrenos
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && portalContainer && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={handleCancelEdit}
            />
            <div className="relative bg-white dark:bg-gray-800 sm:rounded-xl shadow-xl w-full sm:max-w-3xl h-full sm:h-[70vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Configurar Barrenos
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {tempBarrenos.map((barreno, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4"
                  >
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      Barreno {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor={`modal-x-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Posición X
                        </label>
                        <input
                          type="text"
                          id={`modal-x-${index}`}
                          value={barreno.x}
                          onChange={(e) =>
                            handleTempBarrenoChange(index, "x", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Coord. X"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`modal-y-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Posición Y
                        </label>
                        <input
                          type="text"
                          id={`modal-y-${index}`}
                          value={barreno.y}
                          onChange={(e) =>
                            handleTempBarrenoChange(index, "y", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Coord. Y"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`modal-diametro-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Diámetro (mm)
                        </label>
                        <input
                          type="number"
                          id={`modal-diametro-${index}`}
                          value={barreno.diametro}
                          onChange={(e) =>
                            handleTempBarrenoChange(index, "diametro", e.target.value)
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

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>,
          portalContainer
        )}

        {/* View Modal */}
        {isViewModalOpen && portalContainer && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={handleCloseView}
            />
            <div className="relative bg-white dark:bg-gray-800 sm:rounded-xl shadow-xl w-full sm:max-w-3xl h-full sm:h-[70vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Barrenos Configurados
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {barrenos.filter(hasBarrenoData).length < 4 ? (
                  <div className="space-y-2">
                    {barrenos.map((barreno, index) => (
                      hasBarrenoData(barreno) && (
                        <div
                          key={index}
                          className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2"
                        >
                          <div className="font-medium text-gray-700 dark:text-gray-300">
                            Barreno {index + 1}:
                          </div>
                          <div className="mt-1">
                            X: {barreno.x || "-"}, Y: {barreno.y || "-"}, D: {barreno.diametro || "-"} mm
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {barrenos.slice(0, Math.ceil(barrenos.length / 2)).map((barreno, index) => (
                        hasBarrenoData(barreno) && (
                          <div
                            key={index}
                            className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2"
                          >
                            <div className="font-medium text-gray-700 dark:text-gray-300">
                              Barreno {index + 1}:
                            </div>
                            <div className="mt-1">
                              X: {barreno.x || "-"}, Y: {barreno.y || "-"}, D: {barreno.diametro || "-"} mm
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                    <div className="space-y-2">
                      {barrenos.slice(Math.ceil(barrenos.length / 2)).map((barreno, index) => {
                        const actualIndex = index + Math.ceil(barrenos.length / 2);
                        return hasBarrenoData(barreno) && (
                          <div
                            key={actualIndex}
                            className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2"
                          >
                            <div className="font-medium text-gray-700 dark:text-gray-300">
                              Barreno {actualIndex + 1}:
                            </div>
                            <div className="mt-1">
                              X: {barreno.x || "-"}, Y: {barreno.y || "-"}, D: {barreno.diametro || "-"} mm
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseView}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>,
          portalContainer
        )}
      </div>
    </StepContainer>
  );
}