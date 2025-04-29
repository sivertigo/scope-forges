"use client";

import { useState } from "react";
import { TableData } from "@/data/definition";
import ERDPreview from "@/components/erdraw/ERDPreview";
import ERDCreateMenu from "@/components/erdraw/ERDCreateMenu";
import TableTabs from "@/components/erdraw/TableTabs";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table, Eye, Plus } from "lucide-react";

type ViewMode = "both" | "table" | "erd";

export default function GUIEditor() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const [showCreateMenu, setShowCreateMenu] = useState(false);

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
    <div className="space-y-8">
      {tables.length === 0 ? (
        <ERDCreateMenu onTablesGenerated={setTables} />
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "both" ? "outline" : "default"}
              size="sm"
              onClick={() => setViewMode("both")}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              両方表示
            </Button>
            <Button
              variant={viewMode === "table" ? "outline" : "default"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="flex items-center gap-2"
            >
              <Table className="h-4 w-4" />
              テーブルのみ
            </Button>
            <Button
              variant={viewMode === "erd" ? "outline" : "default"}
              size="sm"
              onClick={() => setViewMode("erd")}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              ERDのみ
            </Button>
          </div>
        </div>
      )}

      <div
        className={`grid gap-8 ${
          viewMode === "both" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"
        }`}
      >
        <div className={viewMode === "both" ? "md:col-span-2" : ""}>
          {(viewMode === "both" || viewMode === "table") && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">テーブル一覧</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateMenu(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  クリアして新規作成
                </Button>
              </div>
              <TableTabs
                tables={tables}
                onUpdate={handleTableUpdate}
                onDelete={handleTableDelete}
                onAddTable={addTable}
              />
            </>
          )}
        </div>

        <div
          className={`sticky top-4 ${
            viewMode === "both" ? "md:col-span-1" : ""
          }`}
        >
          {(viewMode === "both" || viewMode === "erd") && (
            <>
              <h2 className="text-xl font-bold mb-4">ERD Preview</h2>
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <ERDPreview tables={tables} />
              </div>
            </>
          )}
        </div>
      </div>

      {showCreateMenu && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <ERDCreateMenu
              onTablesGenerated={(newTables) => {
                setTables(newTables);
                setShowCreateMenu(false);
              }}
            />
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCreateMenu(false)}
              >
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
