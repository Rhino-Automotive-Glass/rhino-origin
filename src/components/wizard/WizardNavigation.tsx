"use client";

import { useState, useEffect } from "react";
import { useWizard } from "./WizardContext";
import { useFormData, EDITING_ID_KEY } from "./FormDataContext";
import { createClient } from "@/app/lib/supabase/client";
import { generateOriginSheetId } from "@/lib/originSheet/storage";
import type { OriginSheet } from "@/types/originSheet";
import { ReviewModal } from "./ReviewModal";

export function WizardNavigation() {
  const { prevStep, nextStep, isFirstStep, isLastStep, currentStep, steps } =
    useWizard();
  const { formData } = useFormData();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pendingSheet, setPendingSheet] = useState<OriginSheet | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);

  const handleFinalizar = () => {
    const now = new Date();
    const editingId = localStorage.getItem(EDITING_ID_KEY);
    const originSheet: OriginSheet = {
      id: editingId || generateOriginSheetId(),
      metadata: {
        creadoPor: userEmail || "Usuario desconocido",
        fechaGuardado: now.toISOString(),
        fechaFormateada: now.toLocaleString("es-MX", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        verificadoPor: null,
      },
      InformacionOrigen: {
        rhinoCode: formData.originSheetInfo.rhinoCode || null,
        descripcion: formData.originSheetInfo.descripcion || null,
        claveExterna: formData.originSheetInfo.claveExterna || null,
      },
      Preparacion: {
        espesores: formData.preparacion.espesores,
        espesorCustom: formData.preparacion.espesorCustom || null,
        tolerancia: formData.preparacion.tolerancia || null,
        origen: formData.preparacion.origen || null,
        origenCustom: formData.preparacion.origenCustom || null,
      },
      Diseno: {
        archivos: formData.diseno.persistedFiles.map((file) => ({
          id: file.id,
          nombre: file.filename,
          tipo: file.file_type,
          tamaño: file.file_size,
          url: file.blob_url,
        })),
      },
      Corte: {
        ejeX: formData.corte.ejeX || null,
        ejeY: formData.corte.ejeY || null,
        area: formData.corte.area || null,
      },
      Barrenos: {
        aplica: formData.barrenos.aplica,
        cantidad: formData.barrenos.cantidadBarrenos,
        barrenos: formData.barrenos.barrenos.map((b, i) => ({
          numero: i + 1,
          posicionX: b.x || null,
          posicionY: b.y || null,
          diametro: b.diametro || null,
        })),
      },
      Templado: {
        tipoMolde: formData.templado.tipoMolde || null,
        tipoProceso: formData.templado.tipoProceso || null,
        radioCilindro: formData.templado.radioCilindro || null,
      },
      Pulido: {
        metrosLineales: formData.pulido.metrosLineales || null,
        tipoPulido: formData.pulido.tipoPulido || null,
      },
      Serigrafia: {
        aplica: formData.serigrafia.aplica,
        color: formData.serigrafia.color || null,
        defroster: {
          aplica: formData.serigrafia.defroster_aplica,
          area: formData.serigrafia.defroster_area || null,
        },
      },
      Marca: {
        marca: formData.marca.marca || null,
        colorMarca: formData.marca.colorMarca || null,
        numeroMain: formData.marca.numeroMain || null,
        coordenadasMain: formData.marca.coordenadasMain || null,
      },
      Observaciones: {
        notas: formData.observaciones.notas || null,
      },
    };

    console.log("Origin Sheet — handleFinalizar", JSON.stringify(originSheet, null, 2));

    setPendingSheet(originSheet);
    setShowReviewModal(true);
  };

  return (
    <div className="relative">
      {showReviewModal && pendingSheet && (
        <ReviewModal
          originSheet={pendingSheet}
          onClose={() => {
            setShowReviewModal(false);
            setPendingSheet(null);
          }}
        />
      )}

      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
        <button
          onClick={prevStep}
          disabled={isFirstStep}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium
            transition-all duration-200
            ${
              isFirstStep
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            }
          `}
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Anterior
        </button>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          Paso {currentStep + 1} de {steps.length}
        </span>

        <button
          onClick={isLastStep ? handleFinalizar : nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLastStep ? (
            <>
              Finalizar
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </>
          ) : (
            <>
              Siguiente
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
