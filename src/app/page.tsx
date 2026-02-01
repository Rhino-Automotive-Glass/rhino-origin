"use client";

import {
  WizardProvider,
  FormDataProvider,
  ProgressBar,
  WizardNavigation,
  WizardContent,
} from "@/components/wizard";
import { ThemeToggle } from "@/components/theme";
import { OrderInfoSection } from "@/components/OrderInfoSection";

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
                      Sistema de Órdenes de Vidrio Automotriz
                    </p>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Order Info Section */}
          <OrderInfoSection />

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
                Rhino Origin - Sistema de Órdenes de Vidrio Automotriz
              </p>
            </div>
          </footer>
        </div>
      </FormDataProvider>
    </WizardProvider>
  );
}
