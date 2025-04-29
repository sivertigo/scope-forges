"use client";

import { TableData } from "@/data/definition";
import mermaid from "mermaid";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { convertERDToMermaid } from "@/lib/utils";

interface ERDPreviewProps {
  tables: TableData[];
}

export default function ERDPreview({ tables }: ERDPreviewProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mermaidRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: "default",
        securityLevel: "loose",
      });
      const mermaidCode = convertERDToMermaid(tables);

      mermaid.render("mermaid-diagram", mermaidCode).then(({ svg }) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
        }
      });
    }
  }, [tables]);

  const handleExportText = () => {
    const mermaidCode = convertERDToMermaid(tables);
    const blob = new Blob([mermaidCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "erd-diagram.mmd";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow bg-gray-800">
      <div className="flex justify-end gap-2 mb-4">
        <Button
          onClick={handleExportText}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          テキストとしてエクスポート
        </Button>
      </div>
      <div ref={mermaidRef} className="mermaid"></div>
    </div>
  );
}
