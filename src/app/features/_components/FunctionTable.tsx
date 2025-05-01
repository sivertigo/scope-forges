import { Feature } from "@/types/definition";
import { Icon } from "@/components/ui/icon";
import { useState } from "react";

interface FunctionTableProps {
  functions: Feature[];
  onEdit: (func: Feature) => void;
  onDelete: (id: string) => void;
}

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "select";
  options?: { value: string; label: string }[];
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onChange,
  onKeyDown,
  type = "text",
  options,
}) => {
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  if (type === "select" && options) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      autoFocus
    />
  );
};

export default function FunctionTable({
  functions,
  onEdit,
  onDelete,
}: FunctionTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedFunction, setEditedFunction] = useState<Feature | null>(null);

  const priorityOptions = [
    { value: "高", label: "高" },
    { value: "中", label: "中" },
    { value: "低", label: "低" },
  ];

  const statusOptions = [
    { value: "未着手", label: "未着手" },
    { value: "進行中", label: "進行中" },
    { value: "完了", label: "完了" },
  ];

  const handleEditStart = (func: Feature, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(func.id);
    setEditedFunction({ ...func });
  };

  const handleEditSave = () => {
    if (editedFunction) {
      onEdit(editedFunction);
      setEditingId(null);
      setEditedFunction(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditedFunction(null);
  };

  const handleFieldChange = (field: keyof Feature, value: string) => {
    if (editedFunction) {
      setEditedFunction({ ...editedFunction, [field]: value });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "高":
        return "bg-red-100 text-red-800";
      case "中":
        return "bg-yellow-100 text-yellow-800";
      case "低":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "未着手":
        return "bg-gray-100 text-gray-800";
      case "進行中":
        return "bg-blue-100 text-blue-800";
      case "完了":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                機能名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                説明
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                優先度
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {functions.map((func) => (
              <tr
                key={func.id}
                className={`${editingId === func.id ? "bg-blue-50" : ""}`}
                onDoubleClick={(e) => handleEditStart(func, e)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === func.id ? (
                    <EditableCell
                      value={editedFunction?.name || ""}
                      onChange={(value) => handleFieldChange("name", value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditSave();
                        } else if (e.key === "Escape") {
                          handleEditCancel();
                        }
                      }}
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">
                      {func.name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === func.id ? (
                    <EditableCell
                      value={editedFunction?.description || ""}
                      onChange={(value) =>
                        handleFieldChange("description", value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditSave();
                        } else if (e.key === "Escape") {
                          handleEditCancel();
                        }
                      }}
                    />
                  ) : (
                    <div className="text-sm text-gray-500">
                      {func.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === func.id ? (
                    <EditableCell
                      value={editedFunction?.priority || ""}
                      onChange={(value) => handleFieldChange("priority", value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditSave();
                        } else if (e.key === "Escape") {
                          handleEditCancel();
                        }
                      }}
                      type="select"
                      options={priorityOptions}
                    />
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                        func.priority
                      )}`}
                    >
                      {func.priority}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === func.id ? (
                    <EditableCell
                      value={editedFunction?.status || ""}
                      onChange={(value) => handleFieldChange("status", value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditSave();
                        } else if (e.key === "Escape") {
                          handleEditCancel();
                        }
                      }}
                      type="select"
                      options={statusOptions}
                    />
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        func.status
                      )}`}
                    >
                      {func.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === func.id ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleEditSave}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        キャンセル
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={(e) => handleEditStart(func, e)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(func.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Icon name="delete" size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
