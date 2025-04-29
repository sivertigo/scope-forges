"use client";

import { useState, useRef, useEffect } from "react";
import { DATA_TYPES } from "@/consts/consts";
import { ColumnData, TableData } from "@/data/definition";

type ColumnProps = {
  column: ColumnData;
  onUpdate: (column: ColumnData) => void;
  onDelete: () => void;
  allTables: TableData[];
};

export default function ColumnEditor({
  column,
  onUpdate,
  onDelete,
  allTables,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);
  const [columnName, setColumnName] = useState(column.name);
  const [columnType, setColumnType] = useState(column.type);
  const [isPrimaryKey, setIsPrimaryKey] = useState(column.isPrimaryKey);
  const [isForeignKey, setIsForeignKey] = useState(column.isForeignKey);
  const [foreignKeyTable, setForeignKeyTable] = useState(
    column.foreignKeyReference?.tableId || ""
  );
  const [foreignKeyColumn, setForeignKeyColumn] = useState(
    column.foreignKeyReference?.columnId || ""
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        columnRef.current &&
        !columnRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const handleSave = () => {
    onUpdate({
      ...column,
      name: columnName,
      type: columnType,
      isPrimaryKey,
      isForeignKey,
      comment: "",
      foreignKeyReference: isForeignKey
        ? {
            tableId: foreignKeyTable,
            columnId: foreignKeyColumn,
          }
        : undefined,
    });
    setIsEditing(false);
  };

  const selectedTable = allTables.find((t) => t.id === foreignKeyTable);
  const availableColumns = selectedTable?.columns || [];

  return (
    <div
      ref={columnRef}
      className="border border-gray-600 rounded p-2 bg-gray-700 w-full"
    >
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {/* isEditingがtrueの時にはアクティブになりカーソルがフォーカス */}
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
              placeholder="Column name"
              className="border border-gray-600 bg-gray-800 text-white rounded px-2 py-1 flex-1"
            />
            <select
              value={columnType}
              onChange={(e) => setColumnType(e.target.value)}
              className="border border-gray-600 bg-gray-800 text-white rounded px-2 py-1"
            >
              {DATA_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={isPrimaryKey}
                onChange={(e) => setIsPrimaryKey(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800"
              />
              <span>Primary Key</span>
            </label>
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={isForeignKey}
                onChange={(e) => setIsForeignKey(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800"
              />
              <span>Foreign Key</span>
            </label>
          </div>
          {isForeignKey && (
            <div className="space-y-2">
              <select
                value={foreignKeyTable}
                onChange={(e) => setForeignKeyTable(e.target.value)}
                className="border border-gray-600 bg-gray-800 text-white rounded px-2 py-1 w-full"
              >
                <option value="">Select table</option>
                {allTables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {selectedTable && (
                <select
                  value={foreignKeyColumn}
                  onChange={(e) => setForeignKeyColumn(e.target.value)}
                  className="border border-gray-600 bg-gray-800 text-white rounded px-2 py-1 w-full"
                >
                  <option value="">Select column</option>
                  {availableColumns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center justify-between"
          onClick={() => setIsEditing(true)}
        >
          <div>
            <span className="font-medium text-white">{column.name}</span>
            <span className="text-gray-300 ml-2">({column.type})</span>
            {column.isPrimaryKey && (
              <span className="ml-2 text-blue-400">PK</span>
            )}
            {column.isForeignKey && (
              <span className="ml-2 text-purple-400">FK</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-400 hover:text-blue-300"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
