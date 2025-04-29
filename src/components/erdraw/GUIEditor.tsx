"use client";

import { useState, useEffect } from "react";
import { TableData } from "@/data/definition";
import ERDPreview from "@/components/erdraw/ERDPreview";
import ERDCreateMenu from "@/components/erdraw/ERDCreateMenu";
import TableTabs from "@/components/erdraw/TableTabs";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table, Eye, Save, Loader2, Trash2 } from "lucide-react";

type ViewMode = "both" | "table" | "erd";

export default function GUIEditor() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const [isLoading, setIsLoading] = useState(false);

  // localStorageからデータを読み込む
  useEffect(() => {
    const savedTables = localStorage.getItem("erdTables");
    if (savedTables) {
      setTables(JSON.parse(savedTables));
    }
  }, []);

  // テーブルデータが変更されたらlocalStorageに保存
  useEffect(() => {
    if (tables.length > 0) {
      localStorage.setItem("erdTables", JSON.stringify(tables));
    }
  }, [tables]);

  const handleSave = () => {
    localStorage.setItem("erdTables", JSON.stringify(tables));
  };

  const handleLoad = () => {
    setIsLoading(true);
    const savedTables = localStorage.getItem("erdTables");
    if (savedTables) {
      setTables(JSON.parse(savedTables));
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    if (window.confirm("保存されているデータをクリアしてもよろしいですか？")) {
      localStorage.removeItem("erdTables");
      setTables([]);
    }
  };

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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              保存
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoad}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              読み込み
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex items-center gap-2 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              クリア
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
    </div>
  );
}
