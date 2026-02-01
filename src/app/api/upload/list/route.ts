import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import type { PersistedFile } from "@/types/upload";

export async function GET(): Promise<NextResponse> {
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

    // Fetch user's files (RLS ensures only their files are returned)
    const { data, error } = await supabase
      .from("diseno_files")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase select error:", error);
      return NextResponse.json(
        { error: "Failed to fetch files" },
        { status: 500 }
      );
    }

    const files: PersistedFile[] = (data || []).map((row) => ({
      id: row.id,
      blob_url: row.blob_url,
      blob_pathname: row.blob_pathname,
      filename: row.filename,
      file_size: row.file_size,
      content_type: row.content_type,
      file_type: row.file_type,
      order_code: row.order_code,
      created_at: row.created_at,
    }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("List files error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
