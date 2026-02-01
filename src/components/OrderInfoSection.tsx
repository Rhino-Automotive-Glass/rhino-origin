"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormData } from "./wizard/FormDataContext";
import { ProductCodeSearch } from "./ProductCodeSearch";
import { createClient } from "@/app/lib/supabase/client";

const STORAGE_KEY = "rhino-order-info";
const DEBOUNCE_MS = 1000;

export function OrderInfoSection() {
  const { formData, updateOrderInfo } = useFormData();
  const orderInfo = formData.orderInfo;

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Load saved data and user email on mount
  useEffect(() => {
    setMounted(true);
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.orderInfo) {
          updateOrderInfo({
            rhinoCode: parsed.orderInfo.rhinoCode || parsed.orderInfo.codigoRhino || "",
            descripcion: parsed.orderInfo.descripcion || "",
            claveExterna: parsed.orderInfo.claveExterna || "",
          });
        }
        if (parsed.lastSaved) {
          setLastSaved(new Date(parsed.lastSaved));
        }
      } catch (e) {
        console.error("Error loading saved order info:", e);
      }
    }

    // Fetch logged-in user email
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, [updateOrderInfo]);

  // Debounced autosave
  useEffect(() => {
    if (!mounted) return;

    const hasData = Object.values(orderInfo).some((value) => value.trim() !== "");
    if (hasData) {
      setIsSaving(true);
    }

    const timeoutId = setTimeout(() => {
      if (hasData) {
        const now = new Date();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            orderInfo,
            lastSaved: now.toISOString(),
          })
        );
        setLastSaved(now);
        setIsSaving(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      setIsSaving(false);
    };
  }, [orderInfo, mounted]);

  const handleInputChange = useCallback(
    (field: "rhinoCode" | "descripcion" | "claveExterna") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateOrderInfo({ [field]: e.target.value });
      },
    [updateOrderInfo]
  );

  const handleProductCodeChange = useCallback(
    (code: string, description?: string) => {
      updateOrderInfo({
        rhinoCode: code,
        ...(description !== undefined && { descripcion: description }),
      });
    },
    [updateOrderInfo]
  );

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Información de Origen
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="codigoRhino"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Código Rhino/NAGS
              </label>
              <ProductCodeSearch
                value={orderInfo.rhinoCode}
                onChange={handleProductCodeChange}
              />
            </div>
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Descripción
              </label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                value={orderInfo.descripcion}
                onChange={handleInputChange("descripcion")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Descripción de la orden"
              />
            </div>
            <div>
              <label
                htmlFor="claveExterna"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Clave Externa
              </label>
              <input
                type="text"
                id="claveExterna"
                name="claveExterna"
                value={orderInfo.claveExterna}
                onChange={handleInputChange("claveExterna")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Clave externa"
              />
            </div>
          </div>
          {/* Autosave Status */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400">
              {mounted && isSaving ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-500 animate-spin"
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
                  <span>Guardando...</span>
                </div>
              ) : mounted && lastSaved ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
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
                  <span>
                    Guardado automáticamente: {formatDateTime(lastSaved)}
                    {userEmail && ` por ${userEmail}`}
                  </span>
                </div>
              ) : mounted ? (
                <span className="text-gray-400 dark:text-gray-500">
                  Los cambios se guardarán automáticamente
                </span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">
                  &nbsp;
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
