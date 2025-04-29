import React from "react";
import { ElementInput } from "@/components/ElementInput";
import { UIElement } from "@/data/definition";

interface ScreenSectionProps {
  title: string;
  elements: UIElement[];
  onAddElement: () => void;
  onUpdateElement: (index: number, element: UIElement) => void;
  onDeleteElement: (index: number) => void;
}

export const ScreenSection: React.FC<ScreenSectionProps> = ({
  title,
  elements,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
}) => {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={onAddElement}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          要素を追加
        </button>
      </div>
      <div className="space-y-4">
        {elements.map((element, index) => (
          <ElementInput
            key={index}
            element={element}
            onUpdate={(updatedElement: UIElement) =>
              onUpdateElement(index, updatedElement)
            }
            onDelete={() => onDeleteElement(index)}
          />
        ))}
      </div>
    </div>
  );
};
