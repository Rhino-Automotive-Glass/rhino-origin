"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { EDITING_SHEET_KEY, EDITING_ID_KEY, SheetSummary } from "@/components/wizard";
import type { OriginSheet } from "@/types/originSheet";
import AppHeader from "@/components/AppHeader";
import { useRole } from "@/contexts/RoleContext";
import { createPortal } from "react-dom";

interface SheetWithOwner extends OriginSheet {
  user_id: string;
}

export default function HojasOrigenPage() {
  const [sheets, setSheets] = useState<SheetWithOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [verificandoId, setVerificandoId] = useState<string | null>(null);
  const [viewingSheet, setViewingSheet] = useState<SheetWithOwner | null>(null);
  const router = useRouter();
  const { user, permissions, isLoading: roleLoading } = useRole();

  // When role is not yet resolved (loading or query failed), allow all actions
  // Once role is resolved, enforce permissions
  const roleResolved = !roleLoading && permissions !== null;

  const isOwner = (sheet: SheetWithOwner) => user?.id === sheet.user_id;

  const canEditSheet = (sheet: SheetWithOwner) =>
    !roleResolved || permissions?.canEditAllSheets || (permissions?.canEditOwnSheets && isOwner(sheet));

  const canDeleteSheet = (sheet: SheetWithOwner) =>
    !roleResolved || permissions?.canDeleteAllSheets || (permissions?.canDeleteOwnSheets && isOwner(sheet));

  const handleEdit = (sheet: SheetWithOwner) => {
    if (!confirm("Editar esta hoja de origen reemplazará cualquier información que hayas ingresado actualmente en el formulario. ¿Deseas continuar?")) return;
    localStorage.setItem(EDITING_SHEET_KEY, JSON.stringify(sheet));
    localStorage.setItem(EDITING_ID_KEY, sheet.id);
    localStorage.setItem("rhino-origin-sheet-info", JSON.stringify({
      originSheetInfo: {
        rhinoCode: sheet.InformacionOrigen.rhinoCode || "",
        descripcion: sheet.InformacionOrigen.descripcion || "",
        claveExterna: sheet.InformacionOrigen.claveExterna || "",
      },
      lastSaved: new Date().toISOString(),
    }));
    router.push("/");
  };

  useEffect(() => {
    loadSheets();
  }, []);

  const loadSheets = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("origin_sheets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const reconstructed = (data ?? []).map((row) => ({
        id: row.id,
        user_id: row.user_id,
        InformacionOrigen: {
          rhinoCode: row.rhino_code,
          descripcion: row.descripcion,
          claveExterna: row.clave_externa,
        },
        ...row.data,
      })) as SheetWithOwner[];

      setSheets(reconstructed);
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
      const supabase = createClient();
      const { error } = await supabase
        .from("origin_sheets")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSheets((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting origin sheet:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleVerificar = async (sheet: SheetWithOwner) => {
    setVerificandoId(sheet.id);
    try {
      const supabase = createClient();
      const { id, user_id, InformacionOrigen, ...sheetData } = sheet;
      const updatedData = {
        ...sheetData,
        metadata: {
          ...sheetData.metadata,
          verificadoPor: user?.email ?? null,
        },
      };

      const { error } = await supabase
        .from("origin_sheets")
        .update({ data: updatedData, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setSheets((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, metadata: { ...s.metadata, verificadoPor: user?.email ?? null } }
            : s
        )
      );
    } catch (error) {
      console.error("Error updating verificado por:", error);
    } finally {
      setVerificandoId(null);
    }
  };

  const handleUnverificar = async (sheet: SheetWithOwner) => {
    setVerificandoId(sheet.id);
    try {
      const supabase = createClient();
      const { id, user_id, InformacionOrigen, ...sheetData } = sheet;
      const updatedData = {
        ...sheetData,
        metadata: {
          ...sheetData.metadata,
          verificadoPor: null,
        },
      };

      const { error } = await supabase
        .from("origin_sheets")
        .update({ data: updatedData, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setSheets((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, metadata: { ...s.metadata, verificadoPor: null } }
            : s
        )
      );
    } catch (error) {
      console.error("Error removing verificado por:", error);
    } finally {
      setVerificandoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <AppHeader />

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hojas de Origen
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {sheets.length} hoja{sheets.length !== 1 ? "s" : ""} guardada
              {sheets.length !== 1 ? "s" : ""}
            </p>
          </div>
          {(!roleResolved || permissions?.canCreateSheets) && (
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
          )}
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
              {(!roleResolved || permissions?.canCreateSheets)
                ? "Crea tu primera hoja de origen para comenzar"
                : "Aún no se han creado hojas de origen"}
            </p>
            {(!roleResolved || permissions?.canCreateSheets) && (
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
            )}
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
                        {(!roleResolved || permissions?.canVerifySheets) ? (
                          /* Interactive verify/unverify for QA + admins */
                          sheet.metadata.verificadoPor ? (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked
                                onChange={() => handleUnverificar(sheet)}
                                disabled={verificandoId === sheet.id}
                                className="w-4 h-4 accent-blue-600"
                              />
                              <span>{sheet.metadata.verificadoPor}</span>
                            </label>
                          ) : (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={false}
                                onChange={() => handleVerificar(sheet)}
                                disabled={verificandoId === sheet.id}
                                className="w-4 h-4 accent-blue-600"
                              />
                              <span className="italic text-gray-400 dark:text-gray-500">
                                {verificandoId === sheet.id ? "Guardando..." : "Pendiente"}
                              </span>
                            </label>
                          )
                        ) : (
                          /* Read-only for everyone else */
                          sheet.metadata.verificadoPor ? (
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked
                                disabled
                                className="w-4 h-4 accent-blue-600"
                              />
                              {sheet.metadata.verificadoPor}
                            </span>
                          ) : (
                            <span className="italic text-gray-400 dark:text-gray-500">
                              Pendiente
                            </span>
                          )
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setViewingSheet(sheet)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            title="Ver resumen"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          {canEditSheet(sheet) && (
                            <button
                              onClick={() => handleEdit(sheet)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                              title="Editar"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          )}
                          {canDeleteSheet(sheet) && (
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
                          )}
                        </div>
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

      {/* View Summary Modal */}
      {viewingSheet && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewingSheet(null)} />
          <div className="relative bg-white dark:bg-gray-800 sm:rounded-xl shadow-xl w-full sm:max-w-3xl h-full sm:h-[70vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                Resumen — Hoja de Origen
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  viewingSheet.metadata.verificadoPor
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                }`}>
                  {viewingSheet.metadata.verificadoPor ? "Verificado" : "No verificado"}
                </span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {viewingSheet.InformacionOrigen.rhinoCode || "Sin código"}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <SheetSummary originSheet={viewingSheet} />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingSheet(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
