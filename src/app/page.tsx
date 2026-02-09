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
import { OriginSheetInfoSection } from "@/components/OriginSheetInfoSection";
import AppHeader from "@/components/AppHeader";
import { useRole } from "@/contexts/RoleContext";

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
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      Limpiar
    </button>
  );
}

function HomeContent() {
  const { permissions, isLoading } = useRole();

  // Only block if role is fully resolved AND user explicitly lacks permission
  // While loading or if permissions are null (query failed), show the wizard
  const roleResolved = !isLoading && permissions !== null;
  const canCreate = !roleResolved || permissions?.canCreateSheets;

  if (roleResolved && !permissions?.canCreateSheets) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <AppHeader />
        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Acceso de Solo Lectura
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              No tienes permisos para crear hojas de origen. Puedes consultar las hojas existentes.
            </p>
            <Link
              href="/hojas-origen"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ver Hojas de Origen
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <AppHeader />

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
  );
}

export default function Home() {
  return (
    <WizardProvider>
      <FormDataProvider>
        <HomeContent />
      </FormDataProvider>
    </WizardProvider>
  );
}
