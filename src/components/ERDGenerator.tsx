"use client";

import { useState } from "react";
import { TableData } from "@/data/definition";

interface ERDGeneratorProps {
  onTablesGenerated: (tables: TableData[]) => void;
}

export default function ERDGenerator({ onTablesGenerated }: ERDGeneratorProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateERD = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-erd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate ERD");
      }

      const data = await response.json();
      onTablesGenerated(data.tables);
    } catch (error) {
      console.error("Error generating ERD:", error);
      alert("ERDの生成に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="erdInput" className="text-sm font-medium">
          ERDの説明を入力してください
        </label>
        <textarea
          id="erdInput"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded min-h-[100px]"
          placeholder="例：ユーザーテーブル（id, name, email）と注文テーブル（id, user_id, amount）を作成してください。"
        />
      </div>
      <button
        onClick={generateERD}
        disabled={isLoading || !inputText.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {isLoading ? "生成中..." : "ERDを生成"}
      </button>
    </div>
  );
}
