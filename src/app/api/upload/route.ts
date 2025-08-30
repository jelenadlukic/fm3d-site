import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const runtime = "nodejs";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  // ✅ stabilno čitanje JWT iz kolačića
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token as any)?.role as string | undefined;
  if (!token || !["ADMIN", "SUPERADMIN"].includes(role || "")) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_BUCKET || "uploads";
  if (!url || !key)
    return NextResponse.json(
      { error: "Supabase env not set" },
      { status: 500 }
    );

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  if (!ALLOWED.has(file.type))
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 415 }
    );
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "File too large" }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `news/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const uploadRes = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
      "cache-control": "public, max-age=31536000, immutable",
      "content-disposition": `inline; filename="${encodeURIComponent(
        file.name
      )}"`,
    },
    body: bytes,
  });

  if (!uploadRes.ok) {
    const txt = await uploadRes.text();
    return NextResponse.json(
      { error: txt || "Upload failed" },
      { status: 500 }
    );
  }

  const publicUrl = `${url}/storage/v1/object/public/${bucket}/${path}`;
  return NextResponse.json({ url: publicUrl, path });
}
