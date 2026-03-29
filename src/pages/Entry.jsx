// src/pages/Entry.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Parse from "@/lib/parse";
import { useJarStore } from "@/store/useJarStore";
import { useUIStore } from "@/store/useUIStore";
import MoodTagPicker from "@/components/entry/MoodTagPicker";
import Button from "@/components/ui/Button";

const FIELD_PROMPTS = [
  "Something that made me smile…",
  "Someone I'm grateful for…",
  "A small moment I want to remember…",
];

const FADE_UP = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.45, ease: "easeOut" },
};

// ── Post-submit success screen ──────────────────────────────────────────────
function SuccessView({ onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.34, 1.12, 0.64, 1] }}
      className="min-h-screen flex flex-col items-center justify-center px-6 gap-8"
    >
      <motion.div
        animate={{
          rotate: [0, -10, 10, -5, 5, 0],
          y:      [0, -14, 0],
        }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-7xl"
      >
        🫙
      </motion.div>

      <div className="text-center flex flex-col gap-2">
        <h2 className="font-serif text-hero text-bloom-ink italic">
          Into the jar it goes
        </h2>
        <p className="font-sans text-sm text-bloom-ink/55">
          Your gratitudes are safe inside. ✨
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl bg-bloom-purple text-white font-sans
            font-medium shadow-bloom transition-all hover:bg-bloom-ink active:scale-[0.98]"
        >
          Back to my jar
        </button>
      </div>
    </motion.div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function Entry() {
  const { activeJar, setJars } = useJarStore();
  const incrementEntryCount = useJarStore(s => s.incrementEntryCount);
  const showToast           = useUIStore(s => s.showToast);
  const navigate            = useNavigate();

  const [jarLoading, setJarLoading] = useState(!activeJar);

  // Load jar if not already in store (e.g. navigated here directly)
  useEffect(() => {
    if (activeJar) { setJarLoading(false); return; }
    async function loadJar() {
      try {
        const currentUser = await Parse.User.currentAsync();
        if (!currentUser) return;
        const sessionToken = currentUser.getSessionToken();

        let results = await new Parse.Query("Jar").find({ sessionToken });

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
      } catch (e) {
        console.error("Jar load error:", e);
      } finally {
        setJarLoading(false);
      }
    }
    loadJar();
  }, [activeJar]); // eslint-disable-line react-hooks/exhaustive-deps

  const [gratitudes, setGratitudes] = useState(["", "", ""]);
  const [mood, setMood]             = useState(null);
  const [loading, setLoading]       = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  function updateGratitude(idx, val) {
    setGratitudes(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  }

  const trimmed = gratitudes.map(g => g.trim());
  // Server requires all 3 entries, each 5–150 chars
  const canSubmit = trimmed.every(g => g.length >= 5 && g.length <= 150);

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await Parse.Cloud.run("saveGratitudeEntry", {
        jarId:    activeJar?.id,
        entry1:   trimmed[0],
        entry2:   trimmed[1],
        entry3:   trimmed[2],
        moodTag1: mood ?? null,
        moodTag2: null,
        moodTag3: null,
      });
      incrementEntryCount();
      setSubmitted(true);
    } catch (err) {
      const msg = err.code === 11609 // DUPLICATE_VALUE
        ? "You've already added to your jar today 🌸 Come back tomorrow!"
        : err.message || "Couldn't save. Try again.";
      showToast(msg, err.code === 11609 ? "info" : "error");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return <SuccessView onBack={() => navigate("/home")} />;
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 relative overflow-hidden">

      {/* ── Ambient blobs ── */}
      <div className="absolute top-[-40px] left-[-20%] w-64 h-64 rounded-full bg-bloom-peach/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-56 h-56 rounded-full bg-bloom-lavender/22 blur-3xl pointer-events-none" />

      {/* ── Back ── */}
      <motion.button
        {...FADE_UP}
        onClick={() => navigate(-1)}
        className="self-start mb-7 font-sans text-sm text-bloom-ink/45
          hover:text-bloom-ink/75 transition-colors"
      >
        ← Back
      </motion.button>

      <div className="max-w-sm w-full mx-auto flex flex-col gap-7">

        {/* ── Header ── */}
        <motion.div {...FADE_UP} className="text-center flex flex-col items-center gap-3">
          <motion.span
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl"
          >
            🌸
          </motion.span>
          <h1 className="font-serif text-hero text-bloom-ink italic leading-tight">
            What are you grateful for?
          </h1>
          <p className="font-sans text-sm text-bloom-ink/50">
            Write three things — big, small, or somewhere between.
          </p>
        </motion.div>

        {/* ── Gratitude fields ── */}
        <div className="flex flex-col gap-4">
          {FIELD_PROMPTS.map((placeholder, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.08, duration: 0.4 }}
            >
              <div className="card-slip p-4 flex gap-3 items-start">
                {/* Ordinal number */}
                <span className="font-serif text-bloom-purple text-lg leading-none mt-0.5 shrink-0 select-none">
                  {i + 1}.
                </span>

                <textarea
                  value={gratitudes[i]}
                  onChange={e => updateGratitude(i, e.target.value)}
                  placeholder={placeholder}
                  rows={2}
                  className="w-full bg-transparent resize-none font-sans text-sm
                    text-bloom-ink placeholder:text-bloom-ink/28 leading-relaxed
                    focus:outline-none"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Mood picker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <p className="font-sans text-xs text-bloom-ink/45 uppercase tracking-wider mb-3">
            How are you feeling?
          </p>
          <MoodTagPicker selected={mood} onSelect={setMood} />
        </motion.div>

        {/* ── Submit ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={!canSubmit || jarLoading}
            loading={loading}
          >
            {loading ? "Adding to your jar…" : "Add to jar 🫙"}
          </Button>
        </motion.div>

        {/* Nudge copy while not all 3 are filled */}
        <AnimatePresence>
          {!canSubmit && trimmed.some(g => g.length > 0) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center font-sans text-xs text-bloom-ink/30 italic -mt-3"
            >
              Fill in all three to add to your jar 🌱
            </motion.p>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
