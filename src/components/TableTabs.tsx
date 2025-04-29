"use client";

import { useState } from "react";
import { TableData } from "@/data/definition";
import TableEditor from "@/components/TableEditor";
import { cn } from "@/lib/utils";

interface TableTabsProps {
  tables: TableData[];
  onUpdate: (updatedTable: TableData) => void;
  onDelete: (tableId: string) => void;
}

export default function TableTabs({
  tables,
  onUpdate,
  onDelete,
}: TableTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  if (tables.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">テーブルがありません</div>
    );
  }

  return (
    <div className="w-full">
      <div className="border-b border-gray-700">
        <nav
          className="-mb-px flex space-x-4 overflow-x-auto"
          aria-label="テーブル一覧"
        >
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm",
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
                "whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm",
                activeTab === table.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              )}
            >
              {table.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === "all" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
