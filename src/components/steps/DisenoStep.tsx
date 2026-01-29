"use client";

import { useState, useRef, useCallback } from "react";
import { StepContainer } from "./StepContainer";
import { useFormData } from "../wizard";

const ACCEPTED_TYPES = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  text: ["text/plain"],
  cad: ["application/dxf", "application/acad", "application/x-acad", "application/x-autocad", "image/vnd.dxf", "image/x-dxf"],
};

const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.gif,.webp,.svg,.txt,.dxf,.dwg";

const CAD_EXTENSIONS = [".dxf", ".dwg"];

export function DisenoStep() {
  const { formData, addDisenoFile, removeDisenoFile } = useFormData();
  const files = formData.diseno.files;
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileExtension = (filename: string): string => {
    return filename.toLowerCase().slice(filename.lastIndexOf("."));
  };

  const isValidFileType = (file: File): boolean => {
    const extension = getFileExtension(file.name);
    return (
      ACCEPTED_TYPES.images.includes(file.type) ||
      ACCEPTED_TYPES.text.includes(file.type) ||
      ACCEPTED_TYPES.cad.includes(file.type) ||
      CAD_EXTENSIONS.includes(extension)
    );
  };

  const getFileType = (file: File): "image" | "text" | "cad" => {
    if (ACCEPTED_TYPES.images.includes(file.type)) return "image";
    const extension = getFileExtension(file.name);
    if (CAD_EXTENSIONS.includes(extension) || ACCEPTED_TYPES.cad.includes(file.type)) return "cad";
    return "text";
  };

  const processFiles = useCallback((fileList: FileList | File[]) => {
    Array.from(fileList).forEach((file) => {
      if (!isValidFileType(file)) {
        return;
      }

      const fileType = getFileType(file);
      const preview = fileType === "image" ? URL.createObjectURL(file) : null;

      addDisenoFile({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        type: fileType,
      });
    });
  }, [addDisenoFile]);

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

  const handleRemoveFile = useCallback((id: string) => {
    removeDisenoFile(id);
  }, [removeDisenoFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <StepContainer
      title="Diseño"
      description="Especificaciones de diseño y geometría del vidrio automotriz."
    >
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
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Archivos subidos ({files.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {files.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  {/* Preview */}
                  {uploadedFile.type === "image" && uploadedFile.preview ? (
                    <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={uploadedFile.preview}
                        alt={uploadedFile.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : uploadedFile.type === "cad" ? (
                    <div className="w-12 h-12 flex-shrink-0 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-500 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-12 h-12 flex-shrink-0 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400 dark:text-gray-500"
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
                    </div>
                  )}

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(uploadedFile.id);
                    }}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                    title="Eliminar archivo"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StepContainer>
  );
}
