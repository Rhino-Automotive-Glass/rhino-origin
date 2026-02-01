// File upload types

export type FileType = "image" | "text" | "cad";

export type UploadStatus = "pending" | "uploading" | "completed" | "failed";

// File stored in Supabase (persisted)
export interface PersistedFile {
  id: string;
  blob_url: string;
  blob_pathname: string;
  filename: string;
  file_size: number;
  content_type: string;
  file_type: FileType;
  order_code: string | null;
  created_at: string;
}

// File being uploaded (in-memory state)
export interface UploadingFile {
  id: string;
  file: File;
  preview: string | null;
  type: FileType;
  status: UploadStatus;
  progress: number;
  error?: string;
  retryCount: number;
}

// Combined file type for display
export interface DisplayFile {
  id: string;
  filename: string;
  file_size: number;
  type: FileType;
  preview: string | null;
  status: UploadStatus;
  progress: number;
  error?: string;
  // Only present for persisted files
  blob_url?: string;
  isPersisted: boolean;
}

// API response types
export interface UploadCompleteRequest {
  blob_url: string;
  blob_pathname: string;
  filename: string;
  file_size: number;
  content_type: string;
  file_type: FileType;
  order_code?: string;
}

export interface UploadCompleteResponse {
  id: string;
  success: boolean;
}

export interface FileListResponse {
  files: PersistedFile[];
}

export interface DeleteFileResponse {
  success: boolean;
}

// Validation
export interface ValidationResult {
  valid: boolean;
  error?: string;
}
