import { useState } from "react";
import { Feature } from "@/types/definition";
import FunctionTable from "@/app/features/_components/FunctionTable";
import AddFunctionButton from "@/app/features/_components/AddFunctionButton";
import { Icon } from "@/components/ui/icon";
import { generateMarkdownTable, downloadMarkdown } from "@/lib/utils";

export default function FunctionManager() {
  const [functions, setFunctions] = useState<Feature[]>([]);

  const handleAddDefaultFunction = () => {
    const defaultFunction: Feature = {
      id: Date.now().toString(),
      name: `機能${functions.length + 1}`,
      description: "",
      priority: "中",
      status: "未着手",
    };
    setFunctions([...functions, defaultFunction]);
  };

  const handleEditFunction = (updatedFunction: Feature) => {
    setFunctions(
      functions.map((func) =>
        func.id === updatedFunction.id ? updatedFunction : func
      )
    );
  };

  const handleDeleteFunction = (id: string) => {
    setFunctions(functions.filter((func) => func.id !== id));
  };

  const handleDownloadMarkdown = () => {
    const markdown = generateMarkdownTable(functions);
    downloadMarkdown(markdown, "機能一覧.md");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">機能一覧</h1>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              <Icon name="download" size={20} />
              <span>Markdownダウンロード</span>
            </button>
            <AddFunctionButton onClick={handleAddDefaultFunction} />
          </div>
        </div>
      </div>

      <FunctionTable
        functions={functions}
        onEdit={handleEditFunction}
        onDelete={handleDeleteFunction}
      />
    </div>
  );
}
