"use client";

import ScreenManager from "@/app/features/_components/FunctionManager";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FunctionTable from "@/app/features/_components/FunctionTable";

export default function Features() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newFunctionId, setNewFunctionId] = useState<string | null>(null);

  const handleAddFunction = () => {
    const newFunction: Feature = {
      id: uuidv4(),
      name: "",
      description: "",
      priority: "中",
      status: "未着手",
    };
    setFeatures([...features, newFunction]);
    setNewFunctionId(newFunction.id);
  };

  const handleEditFunction = (editedFunction: Feature) => {
    setFeatures(
      features.map((f) => (f.id === editedFunction.id ? editedFunction : f))
    );
    setNewFunctionId(null);
  };

  const handleDeleteFunction = (id: string) => {
    setFeatures(features.filter((f) => f.id !== id));
    setNewFunctionId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">機能一覧</h1>
        <button
          onClick={handleAddFunction}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          機能追加
        </button>
      </div>
      <FunctionTable
        functions={features}
        onEdit={handleEditFunction}
        onDelete={handleDeleteFunction}
        newFunctionId={newFunctionId || undefined}
      />
    </div>
  );
}
