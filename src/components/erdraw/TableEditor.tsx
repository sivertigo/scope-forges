"use client";

import { useState } from "react";
import Column from "@/components/erdraw/ColumnEditor";
import { TableData, ColumnData } from "@/data/definition";
import { Icon } from "@/components/ui/icon";
const DEFAULT_VISIBLE_COLUMNS = 6;

type TableProps = {
  table: TableData;
  onUpdate: (table: TableData) => void;
  onDelete: () => void;
  allTables: TableData[];
};

export default function Table({
  table,
  onUpdate,
  onDelete,
  allTables,
}: TableProps) {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [tableName, setTableName] = useState(table.name);
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const moveColumn = (columnId: string, direction: "up" | "down") => {
    const currentIndex = table.columns.findIndex((c) => c.id === columnId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= table.columns.length) return;

    const newColumns = [...table.columns];
    [newColumns[currentIndex], newColumns[newIndex]] = [
      newColumns[newIndex],
      newColumns[currentIndex],
    ];

    onUpdate({
      ...table,
      columns: newColumns,
    });
  };

  const addColumn = () => {
    const newColumn: ColumnData = {
      id: (table.columns.length + 1).toString(),
      name: "column" + (table.columns.length + 1),
      type: "text",
      isPrimaryKey: false,
      isForeignKey: false,
      comment: "",
    };
    onUpdate({
      ...table,
      columns: [...table.columns, newColumn],
    });
  };

  const addSystemColumns = () => {
    const systemColumns: ColumnData[] = [
      {
        id: Date.now().toString(),
        name: "created_at",
        type: "timestamp",
        isPrimaryKey: false,
        isForeignKey: false,
        comment: "登録日",
      },
      {
        id: (Date.now() + 1).toString(),
        name: "created_by",
        type: "int",
        isPrimaryKey: false,
        isForeignKey: false,
        comment: "登録者",
      },
      {
        id: (Date.now() + 2).toString(),
        name: "updated_at",
        type: "timestamp",
        isPrimaryKey: false,
        isForeignKey: false,
        comment: "更新日",
      },
      {
        id: (Date.now() + 3).toString(),
        name: "updated_by",
        type: "int",
        isPrimaryKey: false,
        isForeignKey: false,
        comment: "更新者",
      },
    ];

    onUpdate({
      ...table,
      columns: [...table.columns, ...systemColumns],
    });
  };

  const handleNameChange = () => {
    onUpdate({
      ...table,
      name: tableName,
    });
    setIsTitleEditing(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(`テーブル "${table.name}" を削除してもよろしいですか？`)
    ) {
      onDelete();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAllColumns(!showAllColumns)}
            className="text-gray-400 hover:text-white"
          ></button>
          {isTitleEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNameChange();
                  }
                }}
                className="border border-gray-600 bg-gray-700 text-white rounded px-2 py-1"
              />
              <button
                onClick={handleNameChange}
                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          ) : (
            <h3
              className="text-lg font-semibold text-white cursor-pointer"
              onClick={() => setIsTitleEditing(true)}
            >
              {table.name}
            </h3>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300"
        >
          <Icon name="delete" />
        </button>
      </div>
      <div className="space-y-2">
        {table.columns
          .slice(0, showAllColumns ? undefined : DEFAULT_VISIBLE_COLUMNS)
          .map((column, index) => (
            <div key={column.id} className="flex items-center space-x-2 w-full">
              <div className="flex flex-col space-y-0.5">
                <button
                  onClick={() => moveColumn(column.id, "up")}
                  disabled={index === 0}
                  className="px-1 py-0.5 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveColumn(column.id, "down")}
                  disabled={index === table.columns.length - 1}
                  className="px-1 py-0.5 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  ↓
                </button>
              </div>
              <div className="flex-1">
                <Column
                  key={column.id}
                  column={column}
                  onUpdate={(updatedColumn) => {
                    onUpdate({
                      ...table,
                      columns: table.columns.map((c) =>
                        c.id === updatedColumn.id ? updatedColumn : c
                      ),
                    });
                  }}
                  onDelete={() => {
                    onUpdate({
                      ...table,
                      columns: table.columns.filter((c) => c.id !== column.id),
                    });
                  }}
                  allTables={allTables}
                />
              </div>
            </div>
          ))}
      </div>
      {table.columns.length > DEFAULT_VISIBLE_COLUMNS && !showAllColumns && (
        <button
          onClick={() => setShowAllColumns(true)}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded w-full hover:bg-gray-700"
        >
          残り{table.columns.length - DEFAULT_VISIBLE_COLUMNS}カラムを表示
        </button>
      )}
      {showAllColumns && (
        <button
          onClick={() => setShowAllColumns(false)}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded w-full hover:bg-gray-700"
        >
          最初の{DEFAULT_VISIBLE_COLUMNS}カラムのみ表示
        </button>
      )}
      {/* 左右に配置 */}
      <div className="relative mt-4 flex items-center justify-between">
        <button
          onClick={() => addColumn()}
          className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Icon name="plus" />
          カラムを追加
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded"
          >
            <Icon name="more-vertical" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded shadow-lg z-10">
              <button
                onClick={() => {
                  addSystemColumns();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-600 hover:text-white"
              >
                システムカラム追加
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
