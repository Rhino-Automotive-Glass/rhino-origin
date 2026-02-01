import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import type { UploadCompleteRequest, PersistedFile } from "@/types/upload";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UploadCompleteRequest = await request.json();

    // Validate required fields
    if (
      !body.blob_url ||
      !body.blob_pathname ||
      !body.filename ||
      !body.file_size ||
      !body.content_type ||
      !body.file_type
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file_type
    if (!["image", "text", "cad"].includes(body.file_type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    // Insert file metadata into Supabase
    const { data, error } = await supabase
      .from("diseno_files")
      .insert({
        user_id: user.id,
        blob_url: body.blob_url,
        blob_pathname: body.blob_pathname,
        filename: body.filename,
        file_size: body.file_size,
        content_type: body.content_type,
        file_type: body.file_type,
        order_code: body.order_code || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save file metadata" },
        { status: 500 }
      );
    }

    const persistedFile: PersistedFile = {
      id: data.id,
      blob_url: data.blob_url,
      blob_pathname: data.blob_pathname,
      filename: data.filename,
      file_size: data.file_size,
      content_type: data.content_type,
      file_type: data.file_type,
      order_code: data.order_code,
      created_at: data.created_at,
    };

    return NextResponse.json({
      success: true,
      id: data.id,
      file: persistedFile,
    });
  } catch (error) {
    console.error("Complete upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
