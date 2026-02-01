import type { FileType, ValidationResult } from "@/types/upload";

// Validation constants
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_FILE_COUNT = 10;

export const ACCEPTED_TYPES = {
  images: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
  text: ["text/plain"],
  cad: [
    "application/dxf",
    "application/acad",
    "application/x-acad",
    "application/x-autocad",
    "image/vnd.dxf",
    "image/x-dxf",
    "image/vnd.dwg",
    "image/x-dwg",
    "application/dwg",
    "application/x-dwg",
    "application/octet-stream",
  ],
};

export const CAD_EXTENSIONS = [".dxf", ".dwg"];

export const ACCEPTED_EXTENSIONS =
  ".jpg,.jpeg,.png,.gif,.webp,.svg,.txt,.dxf,.dwg";

export function getFileExtension(filename: string): string {
  return filename.toLowerCase().slice(filename.lastIndexOf("."));
}

export function isValidFileType(file: File): boolean {
  const extension = getFileExtension(file.name);
  return (
    ACCEPTED_TYPES.images.includes(file.type) ||
    ACCEPTED_TYPES.text.includes(file.type) ||
    ACCEPTED_TYPES.cad.includes(file.type) ||
    CAD_EXTENSIONS.includes(extension)
  );
}

export function getFileType(file: File): FileType {
  if (ACCEPTED_TYPES.images.includes(file.type)) return "image";
  const extension = getFileExtension(file.name);
  if (CAD_EXTENSIONS.includes(extension) || ACCEPTED_TYPES.cad.includes(file.type))
    return "cad";
  return "text";
}

export function validateFile(file: File): ValidationResult {
  // Check file type
  if (!isValidFileType(file)) {
    return {
      valid: false,
      error: `Tipo de archivo no válido: ${file.name}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `El archivo "${file.name}" excede el límite de 100MB`,
    };
  }

  return { valid: true };
}

export function validateFileCount(
  currentCount: number,
  newFilesCount: number
): ValidationResult {
  if (currentCount + newFilesCount > MAX_FILE_COUNT) {
    return {
      valid: false,
      error: `Máximo ${MAX_FILE_COUNT} archivos permitidos. Actualmente tienes ${currentCount}.`,
    };
  }
  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
