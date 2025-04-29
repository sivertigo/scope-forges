"use client";

import { TableData } from "@/data/definition";
import mermaid from "mermaid";
import { useEffect, useRef } from "react";

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

  return (
    <div className="bg-white p-4 rounded-lg shadow bg-gray-800">
      <div ref={mermaidRef} className="mermaid"></div>
    </div>
  );
}
