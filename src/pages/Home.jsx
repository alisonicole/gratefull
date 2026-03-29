// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Parse from "@/lib/parse";
import { useAuthStore } from "@/store/useAuthStore";
import { useJarStore } from "@/store/useJarStore";
import { useUIStore } from "@/store/useUIStore";
import JarCanvas from "@/components/jar/JarCanvas";
import { DAILY_GREETINGS, AFFIRMATIONS } from "@/lib/constants";

const FADE_UP = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.5, ease: "easeOut" },
};

export default function Home() {
  const user               = useAuthStore(s => s.user);
  const { activeJar, setJars } = useJarStore();
  const showToast          = useUIStore(s => s.showToast);
  const navigate           = useNavigate();

  const [jarLoading, setJarLoading] = useState(true);
  const [pulling, setPulling]       = useState(false);

  // Stable random picks so they don't re-roll on every render
  const [greeting]    = useState(() =>
    DAILY_GREETINGS[Math.floor(Math.random() * DAILY_GREETINGS.length)]
  );
  const [affirmation] = useState(() =>
    AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]
  );

  // ── Load jars on mount, creating one if missing ──
  useEffect(() => {
    async function loadJars() {
      try {
        const currentUser = await Parse.User.currentAsync();
        if (!currentUser) return;
        const sessionToken = currentUser.getSessionToken();

        let results = await new Parse.Query("Jar").find({ sessionToken });

        // No jar found — call completeOnboarding to create one
        if (results.length === 0) {
          await Parse.Cloud.run("completeOnboarding", {
            jarName:          currentUser.get("jarName") || "My Gratitude Jar",
            jarOrganization:  currentUser.get("jarOrganization") || "single",
            notificationTime: currentUser.get("notificationTime") || null,
            timezone:         Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
          results = await new Parse.Query("Jar").find({ sessionToken });
        }

        setJars(results);
      } catch {
        showToast("Couldn't reach your jar. Try again.", "error");
      } finally {
        setJarLoading(false);
      }
    }
    if (user) loadJars();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived jar stats ──
  const entryCount = activeJar?.get("entryCount") ?? 0;
  const streakDays = activeJar?.get("streakDays") ?? 0;
  const jarName    = activeJar?.get("name")       ?? "My Gratitude Jar";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
  });

  // ── Pull a random slip ──
  async function pullSlip() {
    if (!activeJar || entryCount === 0) {
      showToast("Add some gratitudes first 🌸", "info");
      return;
    }
    setPulling(true);
    try {
      const slip = await Parse.Cloud.run("getRandomSlip", {
        jarId: activeJar.id,
      });
      const slipId = slip?.objectId ?? slip?.id;
      if (!slipId) {
        showToast("No slips in your jar yet 🌸", "info");
        return;
      }
      // Pick one random entry from the three stored on this record
      const candidates = [slip.entry1, slip.entry2, slip.entry3].filter(Boolean);
      const selectedEntry = candidates[Math.floor(Math.random() * candidates.length)];
      navigate(`/slip/${slipId}`, { state: { slip, selectedEntry } });
    } catch (err) {
      showToast(err.message || "Couldn't pull a slip. Try again.", "error");
    } finally {
      setPulling(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 relative overflow-hidden">

      {/* ── Ambient blobs ── */}
      <div className="absolute top-0 right-[-10%] w-80 h-80 rounded-full bg-bloom-lavender/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[-15%] w-64 h-64 rounded-full bg-bloom-blush/25 blur-3xl pointer-events-none" />

      {/* ── Date + greeting ── */}
      <motion.div {...FADE_UP} className="w-full max-w-sm mb-4">
        <p className="font-sans text-xs text-bloom-ink/40 uppercase tracking-widest">
          {today}
        </p>
        <h1 className="font-serif text-hero text-bloom-ink italic mt-1 leading-tight">
          {greeting.replace("dreamer", user?.get("displayName") || "dreamer")}
        </h1>
      </motion.div>

      {/* ── Streak badge ── */}
      {streakDays > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12 }}
          className="flex items-center gap-2 card-slip px-4 py-2 mb-4 self-start"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔥
          </motion.span>
          <span className="font-sans text-sm font-medium text-bloom-ink">
            {streakDays} day{streakDays !== 1 ? "s" : ""} in a row
          </span>
        </motion.div>
      )}

      {/* ── Jar ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.34, 1.12, 0.64, 1] }}
        className="flex flex-col items-center gap-3 my-2 w-full max-w-sm"
      >
        {jarLoading ? (
          /* Skeleton shimmer while jar loads */
          <motion.div
            className="w-52 h-80 flex items-center justify-center"
            animate={{ opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-5xl">🫙</span>
          </motion.div>
        ) : (
          <JarCanvas
            entryCount={entryCount}
            streak={streakDays}
            onTap={pullSlip}
          />
        )}

        {/* Jar label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="card-slip px-5 py-2 text-center"
        >
          <p className="font-script text-lg text-bloom-purple">{jarName}</p>
        </motion.div>

        {/* Count copy */}
        <p className="font-sans text-xs text-bloom-ink/38 mt-0.5">
          {entryCount === 0
            ? "Your jar is waiting for its first slip ✨"
            : `${entryCount} gratitude${entryCount === 1 ? "" : "s"} inside`}
        </p>
      </motion.div>

      {/* ── Action buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-sm flex flex-col gap-3 mt-4"
      >
        {/* Pull-a-slip CTA */}
        <button
          onClick={pullSlip}
          disabled={pulling || entryCount === 0}
          className="w-full py-4 rounded-2xl bg-bloom-purple text-white font-sans font-medium
            shadow-bloom transition-all duration-200
            hover:bg-bloom-ink active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pulling ? (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              Reaching in…
            </motion.span>
          ) : (
            "Pull a slip ✨"
          )}
        </button>

        {/* Add entry */}
        <button
          onClick={() => navigate("/entry")}
          className="w-full py-3.5 rounded-2xl border border-bloom-lavender/50
            font-sans text-sm text-bloom-ink/65 font-medium
            transition-all duration-200
            hover:bg-bloom-lavender/10 active:scale-[0.98]"
        >
          Add to jar  +
        </button>
      </motion.div>

      {/* ── Affirmation ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="mt-10 font-serif italic text-center text-bloom-ink/40 text-base
          max-w-xs leading-relaxed"
      >
        "{affirmation}"
      </motion.p>
    </div>
  );
}
