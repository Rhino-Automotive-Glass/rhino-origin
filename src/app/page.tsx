"use client";

import Link from "next/link";
import {
  WizardProvider,
  FormDataProvider,
  useFormData,
  useWizard,
  clearWizardDraft,
  ProgressBar,
  WizardNavigation,
  WizardContent,
} from "@/components/wizard";
import { ThemeToggle } from "@/components/theme";
import { OriginSheetInfoSection } from "@/components/OriginSheetInfoSection";

function LimpiarButton() {
  const { resetForm } = useFormData();
  const { goToStep } = useWizard();

  const handleLimpiar = () => {
    if (!confirm("¿Estás seguro de limpiar todos los datos? Esta acción no se puede deshacer.")) return;
    clearWizardDraft();
    resetForm();
    goToStep(0);
  };

  return (
    <button
      onClick={handleLimpiar}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-red-300 dark:border-red-700"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v16a2 2 0 002 2h12a2 2 0 002-2V7M4 7H2m20 0h-2M4 7h16M10 11v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
        />
      </svg>
      Limpiar
    </button>
  );
}

export default function Home() {
  return (
    <WizardProvider>
      <FormDataProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Page Title Section */}
          <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Crear Hoja de Origen
                </h2>
                <div className="flex items-center gap-2">
                  <LimpiarButton />
                  <Link
                    href="/hojas-origen"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Ver Hojas de Origen
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Origin Sheet Info Section */}
          <OriginSheetInfoSection />

          {/* Progress Bar */}
          <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-[1600px] mx-auto">
              <ProgressBar />
            </div>
          </div>

          {/* Main Content */}
          <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="pt-4">
              <WizardContent />
            </div>
            <WizardNavigation />
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
      </FormDataProvider>
    </WizardProvider>
  );
}
