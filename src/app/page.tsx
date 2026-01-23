"use client";

import {
  WizardProvider,
  ProgressBar,
  WizardNavigation,
  WizardContent,
} from "@/components/wizard";

export default function Home() {
  return (
    <WizardProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                  <h1 className="text-xl font-bold text-gray-900">
                    Rhino Origin
                  </h1>
                  <p className="text-sm text-gray-500">
                    Sistema de Órdenes de Vidrio Automotriz
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Order Info Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Información de Orden
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="cliente"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cliente
                  </label>
                  <input
                    type="text"
                    id="cliente"
                    name="cliente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Nombre del cliente"
                  />
                </div>
                <div>
                  <label
                    htmlFor="codigoRhino"
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                  >
                    Código Rhino/NAGS
                    <a
                      href="https://rhino-product-code-description.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver códigos disponibles"
                      className="text-blue-500 hover:text-blue-700 transition-colors"
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </a>
                  </label>
                  <input
                    type="text"
                    id="codigoRhino"
                    name="codigoRhino"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Ej: RH-12345"
                  />
                </div>
                <div>
                  <label
                    htmlFor="descripcion"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Descripción
                  </label>
                  <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Descripción de la orden"
                  />
                </div>
                <div>
                  <label
                    htmlFor="claveExterna"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Clave Externa
                  </label>
                  <input
                    type="text"
                    id="claveExterna"
                    name="claveExterna"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Clave externa"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <ProgressBar />
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <WizardContent />
          <WizardNavigation />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-500">
              Rhino Origin - Sistema de Órdenes de Vidrio Automotriz
            </p>
          </div>
        </footer>
      </div>
    </WizardProvider>
  );
}
