import { Screen } from "@/types/definition";
import ScreenCard from "@/components/ScreenCard";

interface ScreenListProps {
  screens: Screen[];
  onEdit: (screen: Screen) => void;
  onDelete: (id: string) => void;
}

export default function ScreenList({
  screens,
  onEdit,
  onDelete,
}: ScreenListProps) {
  if (screens.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        画面が登録されていません
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
      {screens.map((screen) => (
        <ScreenCard
          key={screen.id}
          screen={screen}
          onEdit={onEdit}
          onDelete={() => onDelete(screen.id)}
        />
      ))}
    </div>
  );
}
