"use client";

import { useState } from "react";
import { TableData } from "@/data/definition";
import { parseMermaidToTables } from "@/lib/utils";

interface MermaidImporterProps {
  onTablesGenerated: (tables: TableData[]) => void;
}

export default function MermaidImporter({
  onTablesGenerated,
}: MermaidImporterProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const tables = parseMermaidToTables(text);
        console.log(tables);
        onTablesGenerated(tables);
      }
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="mermaidFile" className="text-sm font-medium">
          Mermaid記法のファイルをアップロード
        </label>
        <input
          type="file"
          id="mermaidFile"
          accept=".mmd,.txt"
          onChange={handleFileUpload}
          className="w-full p-2 border border-gray-300 rounded"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
