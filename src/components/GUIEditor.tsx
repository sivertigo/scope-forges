"use client";

import { useState } from "react";
import Table from "@/components/Table";
import { TableData } from "@/data/definition";
import ERDPreview from "@/components/ERDPreview";
import ERDGenerator from "@/components/ERDGenerator";

export default function GUIEditor() {
  const [tables, setTables] = useState<TableData[]>([]);

  const addTable = () => {
    const newTable: TableData = {
      id: Date.now().toString(),
      name: `Table${tables.length + 1}`,
      columns: [],
    };
    setTables([...tables, newTable]);
  };

  return (
    <div className="space-y-8">
      <ERDGenerator onTablesGenerated={setTables} />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">テーブル一覧</h2>
        <button
          onClick={addTable}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          テーブルを追加
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <Table
            key={table.id}
            table={table}
            onUpdate={(updatedTable) => {
              setTables(
                tables.map((t) => (t.id === updatedTable.id ? updatedTable : t))
              );
            }}
            onDelete={() => {
              setTables(tables.filter((t) => t.id !== table.id));
            }}
            allTables={tables}
          />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">ERD Preview</h2>
        <ERDPreview tables={tables} />
      </div>
    </div>
  );
}
