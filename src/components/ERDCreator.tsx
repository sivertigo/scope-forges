"use client";

import { useState } from "react";
import { TableData } from "@/data/definition";
import ERDGenerator from "./ERDGenerator";
import MermaidImporter from "./MermaidImporter";

interface ERDCreatorProps {
  onTablesGenerated: (tables: TableData[]) => void;
}

type CreationMethod = "ai" | "import";

export default function ERDCreator({ onTablesGenerated }: ERDCreatorProps) {
  const [activeMethod, setActiveMethod] = useState<CreationMethod>("ai");

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="ERD作成方法">
          <button
            onClick={() => setActiveMethod("ai")}
            className={`${
              activeMethod === "ai"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            生成AIから作成
          </button>
          <button
            onClick={() => setActiveMethod("import")}
            className={`${
              activeMethod === "import"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            ファイルからImport
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeMethod === "ai" && (
          <ERDGenerator onTablesGenerated={onTablesGenerated} />
        )}
        {activeMethod === "import" && (
          <MermaidImporter onTablesGenerated={onTablesGenerated} />
        )}
      </div>
    </div>
  );
}
