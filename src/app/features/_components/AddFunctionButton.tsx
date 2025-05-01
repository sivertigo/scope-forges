import { Icon } from "@/components/ui/icon";

interface AddFunctionButtonProps {
  onClick: () => void;
}

export default function AddFunctionButton({ onClick }: AddFunctionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      <Icon name="plus" size={20} />
      <span>機能を追加</span>
    </button>
  );
}
