"use client";
import { useState } from "react";

type Props = {
  /** Ime hidden input-a koji čita server action */
  name?: string; // default: "coverUrl"
  /** Inicijalna vrednost (za edit stranicu) */
  defaultValue?: string | null;
};

export function CoverPicker({ name = "coverUrl", defaultValue }: Props) {
  const [url, setUrl] = useState<string>(defaultValue ?? "");
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null);
  const [busy, setBusy] = useState(false);

  async function uploadFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Upload failed");
    return json.url as string;
  }

  function setHidden(value: string) {
    const el = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (el) el.value = value;
  }

  async function handleUseUrl() {
    const raw = url.trim();
    if (!raw) return;
    // trivialna validacija
    if (!/^https?:\/\/.+/i.test(raw)) {
      alert("Unesi pun URL (počinje sa http:// ili https://)");
      return;
    }
    setHidden(raw);
    setPreview(raw);
  }

  return (
    <div className="grid gap-2">
      {/* Hidden input koji server action čita */}
      <input type="hidden" name={name} defaultValue={defaultValue ?? ""} />

      <label className="text-sm opacity-80">Naslovna slika</label>

      {/* A) URL polje */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Zalepi URL slike (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2"
        />
        <button
          type="button"
          onClick={handleUseUrl}
          className="rounded-md border border-border px-3 py-2 text-sm hover:border-primary/60"
        >
          Postavi URL
        </button>
      </div>

      <div className="text-xs opacity-70 -mt-1">
        Umesto uploada, možeš direktno nalepiti link slike sa interneta.
      </div>

      {/* B) Upload fajla (opciono) */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.currentTarget.files?.[0];
            if (!file) return;
            try {
              setBusy(true);
              const uploadedUrl = await uploadFile(file);
              setHidden(uploadedUrl);
              setPreview(uploadedUrl);
              setUrl(uploadedUrl);
            } catch (err: any) {
              alert(err.message || "Upload error");
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-lg border border-border bg-transparent px-3 py-2"
        />
        {busy && <span className="text-xs opacity-70">• Uploadujem…</span>}
      </div>

      {/* Preview */}
      {preview && (
        <div className="mt-2 overflow-hidden rounded-xl border border-border/60 bg-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview slike" className="h-40 w-full object-contain object-center" />
        </div>
      )}

      <p className="text-xs opacity-70">
        Ako ništa ne uneseš, koristiće se fallback slika <code>/images/o-projektu/hero1.png</code>.
      </p>
    </div>
  );
}
