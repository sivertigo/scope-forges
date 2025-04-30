import { useState } from "react";
import { Screen } from "@/types/definition";
import ScreenList from "@/components/ScreenList";
import ScreenTable from "@/components/ScreenTable";
import AddScreenButton from "@/components/AddScreenButton";
import { Icon } from "@/components/ui/icon";
import { generateMarkdownTable, downloadMarkdown } from "@/lib/utils";

export default function ScreenManager() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const handleAddDefaultScreen = () => {
    const defaultScreen: Screen = {
      id: Date.now().toString(),
      name: `画面${screens.length + 1}`,
      description: "",
      elements: [],
      requireAuth: false,
    };
    setScreens([...screens, defaultScreen]);
  };

  const handleEditScreen = (updatedScreen: Screen) => {
    setScreens(
      screens.map((screen) =>
        screen.id === updatedScreen.id ? updatedScreen : screen
      )
    );
  };

  const handleDeleteScreen = (id: string) => {
    setScreens(screens.filter((screen) => screen.id !== id));
  };

  const handleDownloadMarkdown = () => {
    const markdown = generateMarkdownTable(screens);
    downloadMarkdown(markdown, "画面一覧.md");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">画面一覧</h1>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-lg ${
                viewMode === "card"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Icon name="screen" size={20} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg ${
                viewMode === "table"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Icon name="database" size={20} />
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              <Icon name="download" size={20} />
              <span>Markdownダウンロード</span>
            </button>
            <AddScreenButton onClick={handleAddDefaultScreen} />
          </div>
        </div>
      </div>

      {viewMode === "card" ? (
        <ScreenList
          screens={screens}
          onEdit={handleEditScreen}
          onDelete={handleDeleteScreen}
        />
      ) : (
        <ScreenTable
          screens={screens}
          onEdit={handleEditScreen}
          onDelete={handleDeleteScreen}
        />
      )}
    </div>
  );
}
