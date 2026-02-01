"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { StepContainer } from "./StepContainer";
import { useFormData } from "../wizard";
import {
  validateFile,
  validateFileCount,
  getFileType,
  formatFileSize,
  getFileExtension,
  ACCEPTED_EXTENSIONS,
  MAX_FILE_COUNT,
} from "@/lib/upload/validation";
import { uploadFile, deleteFile, listFiles } from "@/lib/upload/uploader";
import type { UploadingFile, PersistedFile } from "@/types/upload";

export function DisenoStep() {
  const {
    formData,
    setPersistedFiles,
    addPersistedFile,
    removePersistedFile,
    addUploadingFile,
    updateUploadingFile,
    removeUploadingFile,
  } = useFormData();

  const persistedFiles = formData.diseno.persistedFiles;
  const uploadingFiles = formData.diseno.uploadingFiles;
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  // Load persisted files on mount
  useEffect(() => {
    async function loadFiles() {
      setIsLoading(true);
      const result = await listFiles();
      if (result.error) {
        setError(result.error);
      } else {
        setPersistedFiles(result.files);
      }
      setIsLoading(false);
    }
    loadFiles();
  }, [setPersistedFiles]);

  const totalFileCount = persistedFiles.length + uploadingFiles.length;

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);

      // Validate file count
      const countValidation = validateFileCount(totalFileCount, files.length);
      if (!countValidation.valid) {
        setError(countValidation.error || null);
        return;
      }

      setError(null);

      for (const file of files) {
        // Validate individual file
        const validation = validateFile(file);
        if (!validation.valid) {
          setError(validation.error || null);
          continue;
        }

        const fileType = getFileType(file);
        const preview = fileType === "image" ? URL.createObjectURL(file) : null;
        const tempId = `uploading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Add to uploading files
        const uploadingFile: UploadingFile = {
          id: tempId,
          file,
          preview,
          type: fileType,
          status: "uploading",
          progress: 0,
          retryCount: 0,
        };

        addUploadingFile(uploadingFile);

        // Start upload
        const result = await uploadFile({
          file,
          fileType,
          onProgress: (progress) => {
            updateUploadingFile(tempId, { progress });
          },
        });

        if (result.success && result.persistedFile) {
          // Remove from uploading, add to persisted
          removeUploadingFile(tempId);
          addPersistedFile(result.persistedFile);
        } else {
          // Mark as failed
          updateUploadingFile(tempId, {
            status: "failed",
            error: result.error,
          });
        }
      }
    },
    [
      totalFileCount,
      addUploadingFile,
      updateUploadingFile,
      removeUploadingFile,
      addPersistedFile,
    ]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [processFiles]
  );

  const handleDeletePersisted = useCallback(
    async (id: string) => {
      setDeletingFileId(id);
      const result = await deleteFile(id);
      if (result.success) {
        removePersistedFile(id);
      } else {
        setError(result.error || "Error al eliminar archivo");
      }
      setDeletingFileId(null);
    },
    [removePersistedFile]
  );

  const handleRemoveUploading = useCallback(
    (id: string) => {
      removeUploadingFile(id);
    },
    [removeUploadingFile]
  );

  const handleRetry = useCallback(
    async (uploadingFile: UploadingFile) => {
      updateUploadingFile(uploadingFile.id, {
        status: "uploading",
        progress: 0,
        error: undefined,
        retryCount: uploadingFile.retryCount + 1,
      });

      const result = await uploadFile({
        file: uploadingFile.file,
        fileType: uploadingFile.type,
        onProgress: (progress) => {
          updateUploadingFile(uploadingFile.id, { progress });
        },
      });

      if (result.success && result.persistedFile) {
        removeUploadingFile(uploadingFile.id);
        addPersistedFile(result.persistedFile);
      } else {
        updateUploadingFile(uploadingFile.id, {
          status: "failed",
          error: result.error,
        });
      }
    },
    [updateUploadingFile, removeUploadingFile, addPersistedFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Get all file names for the summary list
  const allFileNames = [
    ...uploadingFiles.map((f) => ({
      name: f.file.name,
      isUploading: f.status === "uploading",
      isFailed: f.status === "failed",
    })),
    ...persistedFiles.map((f) => ({
      name: f.filename,
      isUploading: false,
      isFailed: false,
    })),
  ];

  return (
    <StepContainer
      title="Diseño"
      description="Especificaciones de diseño y geometría del vidrio automotriz."
    >
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center min-h-[200px]
            border-2 border-dashed rounded-lg cursor-pointer
            transition-all duration-200
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <svg
            className={`w-12 h-12 mb-3 ${
              isDragging
                ? "text-blue-500"
                : "text-gray-400 dark:text-gray-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Click para subir</span> o arrastra y suelta
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Imágenes (JPG, PNG, GIF, WebP, SVG), archivos TXT o CAD (DXF, DWG)
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Máximo 100MB por archivo, {MAX_FILE_COUNT} archivos en total
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-500">Cargando archivos...</span>
          </div>
        )}

        {/* File Names Summary */}
        {!isLoading && totalFileCount > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {allFileNames.map((file, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    file.isFailed
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : file.isUploading
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                  title={file.name}
                >
                  {file.isUploading && (
                    <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {file.isFailed && (
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="truncate max-w-[150px]">{file.name}</span>
                </span>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ver archivos ({totalFileCount})
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && portalContainer && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-gray-800 sm:rounded-xl shadow-xl w-full sm:max-w-3xl h-full sm:h-[70vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Archivos Subidos ({totalFileCount})
              </h3>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Uploading Files */}
              {uploadingFiles.map((uploadingFile) => (
                <div
                  key={uploadingFile.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg ${
                    uploadingFile.status === "failed"
                      ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                      : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                  }`}
                >
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {uploadingFile.type === "image" && uploadingFile.preview ? (
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-600">
                        <img
                          src={uploadingFile.preview}
                          alt={uploadingFile.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          {getFileExtension(uploadingFile.file.name).slice(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white truncate"
                        title={uploadingFile.file.name}
                      >
                        {uploadingFile.file.name}
                      </p>
                      {/* Actions */}
                      <div className="flex-shrink-0 flex items-center gap-1">
                        {uploadingFile.status === "failed" && (
                          <button
                            onClick={() => handleRetry(uploadingFile)}
                            className="p-1.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-all"
                            title="Reintentar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveUploading(uploadingFile.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(uploadingFile.file.size)}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {getFileExtension(uploadingFile.file.name).slice(1)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {uploadingFile.status === "uploading" && (
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadingFile.progress}%` }}
                        />
                      </div>
                    )}

                    {/* Error Badge */}
                    {uploadingFile.status === "failed" && (
                      <span
                        className="inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 cursor-help"
                        title={uploadingFile.error || "Error al subir"}
                      >
                        Error al subir
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Persisted Files */}
              {persistedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {file.file_type === "image" ? (
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-600">
                        <img
                          src={file.blob_url}
                          alt={file.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          {getFileExtension(file.filename).slice(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white truncate"
                        title={file.filename}
                      >
                        {file.filename}
                      </p>
                      <button
                        onClick={() => handleDeletePersisted(file.id)}
                        disabled={deletingFileId === file.id}
                        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        title="Eliminar archivo"
                      >
                        {deletingFileId === file.id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.file_size)}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {getFileExtension(file.filename).slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {totalFileCount === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay archivos subidos
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        portalContainer
      )}
    </StepContainer>
  );
}
