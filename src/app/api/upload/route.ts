import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { BUCKET } from "@/lib/bucket";

/**
 * Ovaj endpoint očekuje FormData sa poljem "file".
 * Vraća { path } koji zatim CoverUploader upiše u hidden input "coverPath".
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Fajl nije poslat." }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const objectPath = `posts/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error, data } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(objectPath, file, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ path: data?.path || objectPath });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Greška" },
      { status: 500 }
    );
  }
}
