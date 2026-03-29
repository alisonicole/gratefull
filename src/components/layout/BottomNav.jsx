import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/home",    label: "Jar",     icon: "🫙" },
  { to: "/entry",   label: "Add",     icon: "✨" },
  { to: "/feed",    label: "Feed",    icon: "🌸" },
  { to: "/profile", label: "Profile", icon: "🌙" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 card-glass border-t border-bloom-lavender/30 flex justify-around py-3 px-4">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs transition-colors ${
              isActive ? "text-bloom-purple font-medium" : "text-bloom-ink/50"
            }`
          }
        >
          <span className="text-xl">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}