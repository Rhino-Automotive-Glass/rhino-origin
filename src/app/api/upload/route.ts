import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Validate file extension
        const extension = pathname.toLowerCase().slice(pathname.lastIndexOf("."));
        const allowedExtensions = [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".webp",
          ".svg",
          ".txt",
          ".dxf",
          ".dwg",
        ];

        if (!allowedExtensions.includes(extension)) {
          throw new Error("File type not allowed");
        }

        return {
          allowedContentTypes: [
            // Images
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/svg+xml",
            // Text
            "text/plain",
            // CAD
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
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }
}
