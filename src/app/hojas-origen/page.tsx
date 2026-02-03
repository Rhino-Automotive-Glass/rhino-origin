"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { originSheetStorage } from "@/lib/originSheet/storage";
import type { OriginSheet } from "@/types/originSheet";
import { ThemeToggle } from "@/components/theme";

export default function HojasOrigenPage() {
  const [sheets, setSheets] = useState<OriginSheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadSheets();
  }, []);

  const loadSheets = async () => {
    setIsLoading(true);
    try {
      const data = await originSheetStorage.getAll();
      // Sort by date, newest first
      data.sort(
        (a, b) =>
          new Date(b.metadata.fechaGuardado).getTime() -
          new Date(a.metadata.fechaGuardado).getTime()
      );
      setSheets(data);
    } catch (error) {
      console.error("Error loading origin sheets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta hoja de origen?")) return;

    setDeletingId(id);
    try {
      await originSheetStorage.delete(id);
      setSheets((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting origin sheet:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Rhino Origin
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sistema de Formatos de Origen
                  </p>
                </div>
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hojas de Origen
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {sheets.length} hoja{sheets.length !== 1 ? "s" : ""} guardada
              {sheets.length !== 1 ? "s" : ""} en esta sesión
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva Hoja de Origen
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <svg
              className="w-8 h-8 text-blue-600 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : sheets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay hojas de origen
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Crea tu primera hoja de origen para comenzar
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Crear Hoja de Origen
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Código Rhino
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Clave Externa
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Creado Por
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Verificado Por
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sheets.map((sheet) => (
                    <tr
                      key={sheet.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {sheet.InformacionOrigen.rhinoCode || (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Sin código
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {sheet.InformacionOrigen.descripcion || (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Sin descripción
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {sheet.InformacionOrigen.claveExterna || (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Sin clave
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {sheet.metadata.fechaFormateada}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {sheet.metadata.creadoPor}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {sheet.metadata.verificadoPor || (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(sheet.id)}
                          disabled={deletingId === sheet.id}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                          title="Eliminar"
                        >
                          {deletingId === sheet.id ? (
                            <svg
                              className="w-5 h-5 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Rhino Origin - Sistema de Formatos de Origen
          </p>
        </div>
      </footer>
    </div>
  );
}
