"use client";

import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { buildDownloadFilename } from "@/lib/copy-llm-config";
import { useState } from "react";

type TProps = {
  mdxPath: string;
  label?: string;
  filenameOverride?: string;
};

export function CopyLLMVersion(props: TProps) {
  const [busy, setBusy] = useState(false);
  const label = props.label || "Copy LLM version";

  async function fetchJson() {
    const res = await fetch(`/api/raw-mdx?path=${encodeURIComponent(props.mdxPath)}&format=json`);
    if (!res.ok) throw new Error("failed");
    return (await res.json()) as { title: string; content: string };
  }

  async function handleCopy() {
    setBusy(true);
    try {
      const data = await fetchJson();
      await navigator.clipboard.writeText(data.content);
    } finally {
      setBusy(false);
    }
  }

  function handleOpen() {
    const url = `/api/raw-mdx?path=${encodeURIComponent(props.mdxPath)}&format=txt`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleDownload() {
    setBusy(true);
    try {
      const data = await fetchJson();
      const filename = buildDownloadFilename(data.title, props.filenameOverride);
      const blob = new Blob([data.content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={busy}>{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleOpen}>Open raw in new tab</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>Copy to clipboard</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload}>Download as .txt</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
