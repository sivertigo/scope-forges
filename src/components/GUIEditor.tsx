"use client";

import { useState } from "react";
import { TableData } from "@/data/definition";
import ERDPreview from "@/components/ERDPreview";
import ERDCreateMenu from "@/components/ERDCreateMenu";
import TableTabs from "@/components/TableTabs";

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

  const handleTableUpdate = (updatedTable: TableData) => {
    setTables(tables.map((t) => (t.id === updatedTable.id ? updatedTable : t)));
  };

  const handleTableDelete = (tableId: string) => {
    setTables(tables.filter((t) => t.id !== tableId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-8">
        <ERDCreateMenu onTablesGenerated={setTables} />

        <div>
          <h2 className="text-xl font-bold mb-4">テーブル一覧</h2>
          <TableTabs
            tables={tables}
            onUpdate={handleTableUpdate}
            onDelete={handleTableDelete}
            onAddTable={addTable}
          />
        </div>
      </div>

      <div className="sticky top-4">
        <h2 className="text-xl font-bold mb-4">ERD Preview</h2>
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <ERDPreview tables={tables} />
        </div>
      </div>
    </div>
  );
}
