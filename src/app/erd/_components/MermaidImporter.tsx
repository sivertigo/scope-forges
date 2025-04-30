"use client";

import { useState, useCallback } from "react";
import { TableData } from "@/types/definition";
import { parseMermaidToTables } from "@/lib/utils";
import { Upload, Loader2 } from "lucide-react";

interface MermaidImporterProps {
  onTablesGenerated: (tables: TableData[]) => void;
}

export default function MermaidImporter({
  onTablesGenerated,
}: MermaidImporterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          const tables = parseMermaidToTables(text);
          onTablesGenerated(tables);
        }
        setIsLoading(false);
      };

      reader.readAsText(file);
    },
    [onTablesGenerated]
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="mermaidFile"
          accept=".mmd,.txt"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isLoading}
        />
        <label
          htmlFor="mermaidFile"
          className={`flex flex-col items-center justify-center w-full h-full cursor-pointer ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          ) : (
            <>
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="text-sm font-medium text-gray-700">
                ファイルをドラッグ&ドロップ
              </p>
              <p className="text-xs text-gray-500">または</p>
              <p className="text-sm font-medium text-blue-600">
                ファイルを選択
              </p>
              <p className="text-xs text-gray-500 mt-2">
                対応ファイル: .mmd, .txt
              </p>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
