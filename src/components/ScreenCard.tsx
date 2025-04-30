import { useState } from "react";
import { Screen } from "@/types/definition";

interface ScreenCardProps {
  screen: Screen;
  onEdit: (screen: Screen) => void;
  onDelete: () => void;
}

export default function ScreenCard({
  screen,
  onEdit,
  onDelete,
}: ScreenCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedScreen, setEditedScreen] = useState<Screen>(screen);

  const handleSave = () => {
    onEdit(editedScreen);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedScreen(screen);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            画面名
          </label>
          <input
            type="text"
            value={editedScreen.name}
            onChange={(e) =>
              setEditedScreen({ ...editedScreen, name: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            機能概要
          </label>
          <textarea
            value={editedScreen.description}
            onChange={(e) =>
              setEditedScreen({ ...editedScreen, description: e.target.value })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editedScreen.requireAuth}
              onChange={(e) =>
                setEditedScreen({
                  ...editedScreen,
                  requireAuth: e.target.checked,
                })
              }
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 text-sm font-bold">
              認証が必要な画面
            </span>
          </label>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            保存
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-4">
      <div
        className="flex justify-between items-start mb-2"
        onClick={() => setIsEditing(true)}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{screen.name}</h3>
          {screen.requireAuth && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
              認証必須
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            編集
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            削除
          </button>
        </div>
      </div>
      <p className="text-gray-600">{screen.description}</p>
    </div>
  );
}
