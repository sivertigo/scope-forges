import { Screen } from "@/types/definition";
import { Icon } from "@/components/ui/icon";

interface ScreenTableProps {
  screens: Screen[];
  onEdit: (screen: Screen) => void;
  onDelete: (id: string) => void;
}

export default function ScreenTable({
  screens,
  onEdit,
  onDelete,
}: ScreenTableProps) {
  if (screens.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        画面が登録されていません
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              画面名
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              認証
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              機能概要
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {screens.map((screen) => (
            <tr key={screen.id} className="hover:bg-gray-50">
              <td className="py-4 px-4">
                <div className="text-sm font-medium text-gray-900">
                  {screen.name}
                </div>
              </td>
              <td className="py-4 px-4">
                {screen.requireAuth ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    認証必須
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    認証不要
                  </span>
                )}
              </td>
              <td className="py-4 px-4">
                <div className="text-sm text-gray-500">
                  {screen.description}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(screen)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Icon name="edit" size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(screen.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Icon name="delete" size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
