import React, { useState } from "react";
import { ScreenSection } from "@/components/ScreenSection";
import { PreviewArea } from "@/components/PreviewArea";
import { UIElement } from "@/data/definition";

export const ScreenDesignForm: React.FC = () => {
  const [sections, setSections] = useState([
    {
      title: "ヘッダー",
      elements: [] as UIElement[],
    },
    {
      title: "メインコンテンツ",
      elements: [] as UIElement[],
    },
    {
      title: "フッター",
      elements: [] as UIElement[],
    },
  ]);

  const handleAddElement = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].elements.push({
      id: "",
      type: "text",
      label: "",
      description: "",
      required: false,
      value: "",
    });
    setSections(newSections);
  };

  const handleUpdateElement = (
    sectionIndex: number,
    elementIndex: number,
    element: UIElement
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].elements[elementIndex] = element;
    setSections(newSections);
  };

  const handleDeleteElement = (sectionIndex: number, elementIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].elements.splice(elementIndex, 1);
    setSections(newSections);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">画面設計書</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">設計フォーム</h2>
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <ScreenSection
                key={sectionIndex}
                title={section.title}
                elements={section.elements}
                onAddElement={() => handleAddElement(sectionIndex)}
                onUpdateElement={(elementIndex, element) =>
                  handleUpdateElement(sectionIndex, elementIndex, element)
                }
                onDeleteElement={(elementIndex) =>
                  handleDeleteElement(sectionIndex, elementIndex)
                }
              />
            ))}
          </div>
        </div>
        <div>
          <PreviewArea sections={sections} title="プレビュー" />
        </div>
      </div>
    </div>
  );
};
