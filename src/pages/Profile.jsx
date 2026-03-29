// src/pages/Profile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useJarStore } from "@/store/useJarStore";

const FADE_UP = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.45, ease: "easeOut" },
};

export default function Profile() {
  const user      = useAuthStore(s => s.user);
  const logout    = useAuthStore(s => s.logout);
  const activeJar = useJarStore(s => s.activeJar);
  const navigate  = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);

  const displayName  = user?.get("displayName") || user?.get("username") || "Dreamer";
  const avatarColor  = user?.get("avatarColor") || "#C9B8E8";
  const initials     = displayName.slice(0, 2).toUpperCase();
  const entryCount   = user?.get("totalEntries") ?? activeJar?.get("entryCount") ?? 0;
  const streakDays   = activeJar?.get("streakDays") ?? 0;
  const jarName      = activeJar?.get("name") ?? user?.get("jarName") ?? "My Gratitude Jar";

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    navigate("/");
  }

  const stats = [
    { label: "Gratitudes",  value: entryCount,  icon: "✨" },
    { label: "Day streak",  value: streakDays,   icon: "🔥" },
  ];

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 relative overflow-hidden">

      {/* Blobs */}
      <div className="absolute top-0 right-[-10%] w-64 h-64 rounded-full bg-bloom-lavender/22 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-56 h-56 rounded-full bg-bloom-peach/18 blur-3xl pointer-events-none" />

      <div className="max-w-sm w-full mx-auto flex flex-col gap-7">

        {/* Avatar + name */}
        <motion.div {...FADE_UP} className="flex flex-col items-center gap-4 pt-4">
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full flex items-center justify-center
              text-white font-sans font-medium text-2xl shadow-bloom"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </motion.div>
          <div className="text-center">
            <h1 className="font-serif text-hero text-bloom-ink italic">{displayName}</h1>
            <p className="font-script text-bloom-purple text-base mt-0.5">{jarName}</p>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-3"
        >
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="flex-1 card-slip p-4 text-center flex flex-col gap-1">
              <span className="text-2xl">{icon}</span>
              <p className="font-sans text-2xl font-medium text-bloom-ink">{value}</p>
              <p className="font-sans text-xs text-bloom-ink/45">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Menu items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-3"
        >
          <MenuItem
            icon="📖"
            label="My Reflections"
            sub="Your private journal entries"
            onClick={() => navigate("/reflections")}
          />
          <MenuItem
            icon="🫙"
            label="My Jar"
            sub="Return to your gratitude jar"
            onClick={() => navigate("/home")}
          />
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4"
        >
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-3.5 rounded-2xl border border-bloom-lavender/40
              font-sans text-sm text-bloom-ink/50 font-medium
              transition-all hover:bg-bloom-lavender/10 hover:text-bloom-ink/70
              disabled:opacity-40"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </motion.div>

      </div>
    </div>
  );
}

function MenuItem({ icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full card-glass p-4 flex items-center gap-4 text-left
        transition-all hover:scale-[1.01] active:scale-[0.99]"
    >
      <span className="text-2xl shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium text-bloom-ink">{label}</p>
        <p className="font-sans text-xs text-bloom-ink/45 mt-0.5">{sub}</p>
      </div>
      <span className="text-bloom-ink/25 font-sans text-sm shrink-0">→</span>
    </button>
  );
}
