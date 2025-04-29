"use client";

import { TableData } from "@/data/definition";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Download, FileText } from "lucide-react";

interface ERDPreviewProps {
  tables: TableData[];
}

const convertERDToMermaid = (tables: TableData[]) => {
  let mermaidCode = "erDiagram\n";

  // テーブル定義
  tables.forEach((table) => {
    mermaidCode += `    ${table.name} {\n`;
    table.columns.forEach((column) => {
      let columnDef = `        ${column.type} ${column.name}`;
      if (column.isPrimaryKey) columnDef += " PK";
      if (column.isForeignKey) {
        columnDef += ` FK`;
      }
      mermaidCode += columnDef + "\n";
    });
    mermaidCode += "    }\n";
  });

  // リレーションシップ定義
  tables.forEach((table) => {
    table.columns.forEach((column) => {
      if (column.isForeignKey && column.foreignKeyReference) {
        const refTable = tables.find(
          (t) => t.id === column.foreignKeyReference?.tableId
        );
        if (refTable) {
          mermaidCode += `    ${refTable.name} ||--o{ ${table.name} : "${column.name}"\n`;
        }
      }
    });
  });

  console.log(mermaidCode);

  return mermaidCode;
};

export default function ERDPreview({ tables }: ERDPreviewProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

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
          setSvgContent(svg);
        }
      });
    }
  }, [tables]);

  const handleExportSVG = () => {
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "erd-diagram.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        <Button
          onClick={handleExportSVG}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          SVGとしてエクスポート
        </Button>
      </div>
      <div ref={mermaidRef} className="mermaid"></div>
    </div>
  );
}
