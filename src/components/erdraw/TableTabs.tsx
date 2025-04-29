"use client";

import { useState } from "react";
import { TableData } from "@/data/definition";
import TableEditor from "@/components/erdraw/TableEditor";
import { cn } from "@/lib/utils";

interface TableTabsProps {
  tables: TableData[];
  onUpdate: (updatedTable: TableData) => void;
  onDelete: (tableId: string) => void;
  onAddTable: () => void;
}

export default function TableTabs({
  tables,
  onUpdate,
  onDelete,
  onAddTable,
}: TableTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  if (tables.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="mb-4">テーブルがありません</p>
        <button
          onClick={onAddTable}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          テーブルを追加
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex">
      <div className="w-64 flex-shrink-0 border-r border-gray-700">
        <div className="flex flex-col">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "w-full text-left py-3 px-4 border-l-2 font-medium text-sm",
              activeTab === "all"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            )}
          >
            全てのテーブル
          </button>
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => setActiveTab(table.id)}
              className={cn(
                "w-full text-left py-3 px-4 border-l-2 font-medium text-sm",
                activeTab === table.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              )}
            >
              {table.name}
            </button>
          ))}
          <div className="mt-auto p-4">
            <button
              onClick={onAddTable}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              テーブルを追加
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {activeTab === "all" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {tables.map((table) => (
              <div key={table.id} className="w-full">
                <TableEditor
                  table={table}
                  onUpdate={onUpdate}
                  onDelete={() => onDelete(table.id)}
                  allTables={tables}
                />
              </div>
            ))}
          </div>
        ) : (
          tables.map((table) => (
            <div
              key={table.id}
              className={cn(
                "transition-all duration-200",
                activeTab === table.id ? "block" : "hidden"
              )}
            >
              <TableEditor
                table={table}
                onUpdate={onUpdate}
                onDelete={() => onDelete(table.id)}
                allTables={tables}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
