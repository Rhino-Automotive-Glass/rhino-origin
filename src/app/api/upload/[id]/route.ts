import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { createClient } from "@/app/lib/supabase/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the file to verify ownership and get blob URL
    // RLS ensures only the owner can select their files
    const { data: file, error: selectError } = await supabase
      .from("diseno_files")
      .select("blob_url, blob_pathname")
      .eq("id", id)
      .single();

    if (selectError || !file) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Delete from Vercel Blob
    try {
      await del(file.blob_url);
    } catch (blobError) {
      console.error("Blob deletion error:", blobError);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from Supabase (RLS ensures only owner can delete)
    const { error: deleteError } = await supabase
      .from("diseno_files")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete file metadata" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
