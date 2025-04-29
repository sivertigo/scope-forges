import React from "react";
import { PreviewAreaProps, UIElement } from "@/data/definition";

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  sections,
  title,
}) => {
  const renderElement = (element: UIElement) => {
    switch (element.type) {
      case "text":
        return (
          <p className="text-gray-700 dark:text-gray-300">{element.label}</p>
        );
      case "button":
        return (
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {element.label}
          </button>
        );
      case "input":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {element.label}
              {element.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={element.description}
              defaultValue={element.value}
            />
          </div>
        );
      case "select":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {element.label}
              {element.required && <span className="text-red-500">*</span>}
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">
                {element.description || "選択してください"}
              </option>
            </select>
          </div>
        );
      case "textarea":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {element.label}
              {element.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={element.description}
              defaultValue={element.value}
              rows={4}
            />
          </div>
        );
      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              defaultChecked={element.value === "true"}
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {element.label}
              {element.required && <span className="text-red-500">*</span>}
            </label>
          </div>
        );
      case "radio":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {element.label}
              {element.required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name={element.id}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {element.description || "オプション1"}
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
        {title}
      </h2>
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.elements.map((element, elementIndex) => (
                <div key={elementIndex}>{renderElement(element)}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
