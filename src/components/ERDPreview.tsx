"use client";

import { TableData } from "@/data/definition";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  RefreshCw,
  Maximize2,
  Minimize2,
  Database,
} from "lucide-react";
import { convertERDToMermaid, generatePostgreSQLDDL } from "@/lib/utils";

interface ERDPreviewProps {
  tables: TableData[];
}

export default function ERDPreview({ tables }: ERDPreviewProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderMermaid = () => {
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
  };

  useEffect(() => {
    renderMermaid();
  }, [tables, refreshKey]);

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

  const handleExportDDL = () => {
    const ddl = generatePostgreSQLDDL(tables);
    const blob = new Blob([ddl], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "schema.sql";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`bg-white p-4 rounded-lg shadow bg-gray-800 ${
        isFullscreen ? "fixed inset-0 z-50 p-8 overflow-auto" : ""
      }`}
    >
      <div className="flex justify-end gap-2 mb-4">
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          リフレッシュ
        </Button>
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4" />
              全画面を閉じる
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4" />
              全画面表示
            </>
          )}
        </Button>
        <Button
          onClick={handleExportText}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          テキストとしてエクスポート
        </Button>
        <Button
          onClick={handleExportDDL}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Database className="w-4 h-4" />
          DDLをエクスポート
        </Button>
      </div>
      <div
        ref={mermaidRef}
        className="mermaid overflow-auto max-h-[calc(100vh-8rem)]"
      ></div>
    </div>
  );
}
