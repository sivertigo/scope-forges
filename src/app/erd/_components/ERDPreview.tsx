"use client";

import { TableData } from "@/types/definition";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { convertERDToMermaid, generatePostgreSQLDDL } from "@/lib/utils";
import {
  ERDIconButton,
  RefreshIcon,
  MaximizeIcon,
  MinimizeIcon,
  FileTextIcon,
  DatabaseIcon,
} from "./ERDIcons";
import { TooltipProvider } from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div
        ref={containerRef}
        className={`bg-white p-4 rounded-lg shadow bg-gray-800 ${
          isFullscreen ? "fixed inset-0 z-50 p-8 overflow-auto" : ""
        }`}
      >
        <div className="flex justify-end gap-2 mb-4">
          <ERDIconButton
            icon={<RefreshIcon />}
            label="リフレッシュ"
            onClick={handleRefresh}
          />
          <ERDIconButton
            icon={isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
            label={isFullscreen ? "全画面を閉じる" : "全画面表示"}
            onClick={toggleFullscreen}
          />
          <ERDIconButton
            icon={<FileTextIcon />}
            label="テキストとしてエクスポート"
            onClick={handleExportText}
          />
          <ERDIconButton
            icon={<DatabaseIcon />}
            label="DDLをエクスポート"
            onClick={handleExportDDL}
          />
        </div>
        <div
          ref={mermaidRef}
          className="mermaid overflow-auto max-h-[calc(100vh-8rem)]"
        ></div>
      </div>
    </TooltipProvider>
  );
}
