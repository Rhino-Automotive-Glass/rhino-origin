"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { EDITING_ID_KEY } from "./FormDataContext";
import { SheetSummary } from "./SheetSummary";
import type { OriginSheet } from "@/types/originSheet";

interface ReviewModalProps {
  originSheet: OriginSheet;
  onClose: () => void;
}

export function ReviewModal({ originSheet, onClose }: ReviewModalProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  const handleGuardar = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { id, InformacionOrigen, ...sheetData } = originSheet;
      const editingId = localStorage.getItem(EDITING_ID_KEY);

      if (editingId) {
        const { error: updateError } = await supabase
          .from("origin_sheets")
          .update({
            rhino_code: InformacionOrigen.rhinoCode,
            descripcion: InformacionOrigen.descripcion,
            clave_externa: InformacionOrigen.claveExterna,
            data: sheetData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (updateError) throw updateError;
        localStorage.removeItem(EDITING_ID_KEY);
      } else {
        const { error: insertError } = await supabase
          .from("origin_sheets")
          .insert({
            id,
            user_id: user?.id ?? null,
            rhino_code: InformacionOrigen.rhinoCode,
            descripcion: InformacionOrigen.descripcion,
            clave_externa: InformacionOrigen.claveExterna,
            data: sheetData,
          });

        if (insertError) throw insertError;
      }

      router.push("/hojas-origen");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  if (!portalContainer) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 sm:rounded-xl shadow-xl w-full sm:max-w-3xl h-full sm:h-[70vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Revisión — Hoja de Origen
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Revisa los datos antes de guardar
          </p>
        </div>

        {/* Scrollable summary */}
        <div className="flex-1 overflow-y-auto p-6">
          <SheetSummary originSheet={originSheet} />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 px-4 py-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-all"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={handleGuardar}
            disabled={isSaving}
            className={`
              px-4 py-2 font-medium rounded-lg transition-all flex items-center gap-2
              ${
                isSaving
                  ? "bg-blue-400 cursor-not-allowed text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }
            `}
          >
            {isSaving ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
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
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </button>
        </div>

      </div>
    </div>,
    portalContainer
  );
}
