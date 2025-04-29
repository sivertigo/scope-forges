import React from "react";
import { UIElement } from "@/data/definition";
import { Icon } from "@/components/ui/icon";

interface ElementInputProps {
  element: UIElement;
  onUpdate: (element: UIElement) => void;
  onDelete: () => void;
}

const ELEMENT_TYPES = [
  { value: "text", label: "テキスト" },
  { value: "input", label: "入力フィールド" },
  { value: "select", label: "セレクトボックス" },
  { value: "button", label: "ボタン" },
  { value: "textarea", label: "テキストエリア" },
  { value: "checkbox", label: "チェックボックス" },
  { value: "radio", label: "ラジオボタン" },
];

export const ElementInput: React.FC<ElementInputProps> = ({
  element,
  onUpdate,
  onDelete,
}) => {
  const handleChange = (field: keyof UIElement, value: string | boolean) => {
    onUpdate({ ...element, [field]: value });
  };

  return (
    <div className="border rounded-lg p-4 mb-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">要素の設定</h4>
        <button onClick={onDelete} className="text-red-500 hover:text-red-600">
          <Icon name="delete" size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            要素タイプ
          </label>
          <select
            value={element.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {ELEMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ラベル
          </label>
          <input
            type="text"
            value={element.label}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            説明文
          </label>
          <input
            type="text"
            value={element.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            初期値
          </label>
          <input
            type="text"
            value={element.value}
            onChange={(e) => handleChange("value", e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={element.required}
            onChange={(e) => handleChange("required", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">必須項目</label>
        </div>
      </div>
    </div>
  );
};
