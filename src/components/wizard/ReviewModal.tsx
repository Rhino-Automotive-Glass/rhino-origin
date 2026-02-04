"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
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

      router.push("/hojas-origen");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  if (!portalContainer) return null;

  // Preparación: flatten espesores replacing "otro" with the custom value
  const espesoresArr = originSheet.Preparacion.espesores.filter((e) => e !== "otro");
  if (originSheet.Preparacion.espesorCustom) {
    espesoresArr.push(originSheet.Preparacion.espesorCustom);
  }
  const espesoresDisplay = espesoresArr.length > 0
    ? espesoresArr.map((e) => `${e} mm`).join(", ")
    : "—";

  const origenDisplay = originSheet.Preparacion.origen === "otro"
    ? originSheet.Preparacion.origenCustom || "—"
    : originSheet.Preparacion.origen
      ? originSheet.Preparacion.origen.charAt(0).toUpperCase() +
        originSheet.Preparacion.origen.slice(1)
      : "—";

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
        <div className="flex-1 overflow-y-auto p-6 space-y-3">

          {/* Metadata */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div className="space-y-1">
              <div>Fecha: {originSheet.metadata.fechaFormateada}</div>
              <div>Creado Por: {originSheet.metadata.creadoPor}</div>
              <div>Verificado Por: {originSheet.metadata.verificadoPor || "—"}</div>
            </div>
          </div>

          {/* Información de Origen */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Información de Origen
            </div>
            <div className="mt-2 space-y-1">
              <div>Código Rhino: {originSheet.InformacionOrigen.rhinoCode || "—"}</div>
              <div>Descripción: {originSheet.InformacionOrigen.descripcion || "—"}</div>
              <div>Clave Externa: {originSheet.InformacionOrigen.claveExterna || "—"}</div>
            </div>
          </div>

          {/* Preparación */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Preparación
            </div>
            <div className="mt-2 space-y-1">
              <div>Espesores: {espesoresDisplay}</div>
              <div>Tolerancia: {originSheet.Preparacion.tolerancia || "—"}</div>
              <div>Origen: {origenDisplay}</div>
            </div>
          </div>

          {/* Diseño */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Diseño
            </div>
            <div className="mt-2">
              {originSheet.Diseno.archivos.length > 0 ? (
                <div className="space-y-1">
                  {originSheet.Diseno.archivos.map((archivo) => (
                    <div key={archivo.id}>
                      {archivo.nombre}{" "}
                      <span className="text-gray-400 dark:text-gray-500">
                        ({archivo.tipo})
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Sin archivos</div>
              )}
            </div>
          </div>

          {/* Corte */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Corte
            </div>
            <div className="mt-2 space-y-1">
              <div>Eje X: {originSheet.Corte.ejeX || "—"}</div>
              <div>Eje Y: {originSheet.Corte.ejeY || "—"}</div>
              <div>Área: {originSheet.Corte.area || "—"}</div>
            </div>
          </div>

          {/* Pulido */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Pulido
            </div>
            <div className="mt-2 space-y-1">
              <div>Metros lineales: {originSheet.Pulido.metrosLineales || "—"}</div>
              <div>Tipo de pulido: {originSheet.Pulido.tipoPulido || "—"}</div>
            </div>
          </div>

          {/* Barrenos */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Barrenos
            </div>
            <div className="mt-2">
              {originSheet.Barrenos.aplica ? (
                <div className="space-y-1">
                  <div>Cantidad: {originSheet.Barrenos.cantidad}</div>
                  {originSheet.Barrenos.barrenos.map((b) => (
                    <div key={b.numero} className="ml-3">
                      Barreno {b.numero}: X {b.posicionX || "—"}, Y{" "}
                      {b.posicionY || "—"}, D {b.diametro || "—"} mm
                    </div>
                  ))}
                </div>
              ) : (
                <div>No aplica</div>
              )}
            </div>
          </div>

          {/* Marca */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Marca
            </div>
            <div className="mt-2 space-y-1">
              <div>Marca: {originSheet.Marca.marca || "—"}</div>
              <div>Color: {originSheet.Marca.colorMarca || "—"}</div>
              <div>Número Main: {originSheet.Marca.numeroMain || "—"}</div>
              <div>Coordenadas Main: {originSheet.Marca.coordenadasMain || "—"}</div>
            </div>
          </div>

          {/* Serigrafía */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Serigrafía
            </div>
            <div className="mt-2">
              {originSheet.Serigrafia.aplica ? (
                <div className="space-y-1">
                  <div>Color: {originSheet.Serigrafia.color || "—"}</div>
                  <div>
                    Defroster:{" "}
                    {originSheet.Serigrafia.defroster.aplica
                      ? `Aplica${
                          originSheet.Serigrafia.defroster.area
                            ? ` — Área: ${originSheet.Serigrafia.defroster.area}`
                            : ""
                        }`
                      : "No aplica"}
                  </div>
                </div>
              ) : (
                <div>No aplica</div>
              )}
            </div>
          </div>

          {/* Templado */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Templado
            </div>
            <div className="mt-2 space-y-1">
              <div>Tipo de molde: {originSheet.Templado.tipoMolde || "—"}</div>
              <div>Tipo de proceso: {originSheet.Templado.tipoProceso || "—"}</div>
              <div>Radio cilindro: {originSheet.Templado.radioCilindro || "—"}</div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Observaciones
            </div>
            <div className="mt-2 whitespace-pre-wrap">
              {originSheet.Observaciones.notas || "Sin observaciones"}
            </div>
          </div>

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
