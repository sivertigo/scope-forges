import { useState, useEffect } from "react";
import { Screen } from "@/types/definition";

interface ScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (screen: Screen) => void;
  initialScreen?: Screen | null;
}

export default function ScreenModal({
  isOpen,
  onClose,
  onSubmit,
  initialScreen,
}: ScreenModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialScreen) {
      setName(initialScreen.name);
      setDescription(initialScreen.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [initialScreen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialScreen?.id || crypto.randomUUID(),
      name,
      description,
      elements: [],
      requireAuth: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-400 flex items-center justify-center bg-opacity-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {initialScreen ? "画面を編集" : "画面を追加"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              画面名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              機能概要
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {initialScreen ? "更新" : "追加"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
