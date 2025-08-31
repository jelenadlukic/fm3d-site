"use client";

import { useState } from "react";

export function CoverUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [path, setPath] = useState<string>("");

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));

    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json?.path) setPath(json.path);
  }

  return (
    <div className="grid gap-2">
      <label className="text-sm opacity-80">Naslovna slika</label>
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="hidden" name="coverPath" value={path} />
      {preview && (
        <div className="relative h-40 w-full overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="h-full w-full object-contain bg-black/10" />
        </div>
      )}
      <p className="text-xs opacity-70">Ako si otpremila sliku, koristiće se pre-uploadovani <code>coverPath</code>.</p>
    </div>
  );
}
