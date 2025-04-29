import Icon from "../icons/Icon";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const menuItems = [
    { icon: "home", label: "ホーム", href: "/" },
    { icon: "database", label: "ER図", href: "/er-diagrams" },
    { icon: "settings", label: "設定", href: "/settings" },
  ];

  return (
    <div
      className={`bg-gray-800 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h2 className="text-xl font-bold">ERDraw</h2>}
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-700">
          <Icon name={isCollapsed ? "menu" : "close"} size={24} />
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center p-4 hover:bg-gray-700"
          >
            <Icon
              name={item.icon as "home" | "database" | "settings"}
              size={20}
              className="mr-3"
            />
            {!isCollapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
}
