"use client";

export function CoverUploader() {
  async function upload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Upload failed");
    return json.url as string;
  }

  return (
    <div className="grid gap-2">
      <label className="text-sm opacity-80">Naslovna slika</label>
      <input type="hidden" name="coverUrl" id="coverUrl" />
      <input
        type="file"
        accept="image/*"
        className="rounded-lg border border-border bg-transparent px-3 py-2"
        onChange={async (e) => {
          const file = e.currentTarget.files?.[0];
          if (!file) return;
          try {
            const url = await upload(file);
            (document.getElementById("coverUrl") as HTMLInputElement).value = url;
            alert("Upload uspešan ✅");
          } catch (err: any) {
            alert(err.message || "Upload failed");
          }
        }}
      />
    </div>
  );
}
