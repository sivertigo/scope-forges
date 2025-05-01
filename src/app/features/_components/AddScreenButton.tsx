interface AddScreenButtonProps {
  onClick: () => void;
}

export default function AddScreenButton({ onClick }: AddScreenButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      画面を追加
    </button>
  );
}
