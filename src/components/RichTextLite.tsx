"use client";
import { useRef } from "react";

export function RichTextLite(props: { name: string }) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  function wrapBold() {
    const el = ref.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    const sel = value.slice(selectionStart, selectionEnd) || "tekst";
    const next = value.slice(0, selectionStart) + `**${sel}**` + value.slice(selectionEnd);
    el.value = next;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function addBullets() {
    const el = ref.current;
    if (!el) return;
    const lines = (el.value || "").split("\n");
    const next = lines.map(l => (l.trim() ? `- ${l}` : l)).join("\n");
    el.value = next;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <button type="button" onClick={wrapBold}
          className="rounded-md border border-border px-2 py-1 text-xs hover:border-primary/60">** Bold</button>
        <button type="button" onClick={addBullets}
          className="rounded-md border border-border px-2 py-1 text-xs hover:border-primary/60">• Lista</button>
      </div>
      <textarea ref={ref} name={props.name} rows={8}
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2" />
      <p className="text-xs opacity-70 mt-1">Podržan je **bold** i bullet lista (Markdown stil).</p>
    </div>
  );
}
