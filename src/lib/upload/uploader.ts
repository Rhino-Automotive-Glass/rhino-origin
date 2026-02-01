import { upload } from "@vercel/blob/client";
import type {
  FileType,
  UploadCompleteRequest,
  UploadCompleteResponse,
  PersistedFile,
} from "@/types/upload";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface UploadOptions {
  file: File;
  fileType: FileType;
  onProgress: (progress: number) => void;
  orderCode?: string;
}

interface UploadResult {
  success: boolean;
  persistedFile?: PersistedFile;
  error?: string;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { file, fileType, onProgress, orderCode } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Step 1: Upload to Vercel Blob
      onProgress(0);

      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 90
          );
          onProgress(progress);
        },
      });

      onProgress(95);

      // Step 2: Save metadata to Supabase
      const completeRequest: UploadCompleteRequest = {
        blob_url: blob.url,
        blob_pathname: blob.pathname,
        filename: file.name,
        file_size: file.size,
        content_type: file.type || "application/octet-stream",
        file_type: fileType,
        order_code: orderCode,
      };

      const response = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save file metadata");
      }

      const result: UploadCompleteResponse & { file?: PersistedFile } =
        await response.json();

      onProgress(100);

      return {
        success: true,
        persistedFile: result.file,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on the last attempt
      if (attempt < MAX_RETRIES - 1) {
        const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        await delay(delayMs);
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || "Upload failed after retries",
  };
}

export async function deleteFile(fileId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/upload/${fileId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to delete file");
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

export async function listFiles(): Promise<{ files: PersistedFile[]; error?: string }> {
  try {
    const response = await fetch("/api/upload/list");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to list files");
    }

    const data: { files: PersistedFile[] } = await response.json();
    return { files: data.files };
  } catch (error) {
    return {
      files: [],
      error: error instanceof Error ? error.message : "Failed to load files",
    };
  }
}
