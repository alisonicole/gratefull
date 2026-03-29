// src/pages/Reflect.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Parse from "@/lib/parse";

const FADE_UP = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.5, ease: "easeOut" },
};

const PLACEHOLDER =
  "What comes up when you sit with this? There's no right answer — just let it flow…";

export default function Reflect() {
  const { id }   = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const state         = location.state ?? {};
  const slip          = state.slip;
  const prompt        = state.prompt;
  const selectedEntry = state.selectedEntry ?? slip?.entry1;

  const [reflection, setReflection] = useState("");
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [wordCount, setWordCount]   = useState(0);

  const saveTimerRef  = useRef(null);
  const lastSavedRef  = useRef("");

  // Normalise prompt to a plain string
  const promptText = typeof prompt === "string"
    ? prompt
    : prompt?.prompt ?? prompt?.insight ?? null;

  // ── Autosave (debounced 2 s after typing stops) ──────────────────────────
  async function doSave(text) {
    if (!text.trim() || text === lastSavedRef.current) return;
    setSaving(true);
    try {
      await Parse.Cloud.run("saveReflection", {
        entryId:    id,
        reflection: text.trim(),
      });
      lastSavedRef.current = text;
      setSaved(true);
    } catch {
      // Silent fail on autosave — user can retry via Done button
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e) {
    const val = e.target.value;
    setReflection(val);
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
    setSaved(false);

    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => doSave(val), 2000);
  }

  // ── Save on unmount (best-effort) ────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimeout(saveTimerRef.current);
      const unsaved = reflection.trim() && reflection !== lastSavedRef.current;
      if (unsaved) {
        Parse.Cloud.run("saveReflection", {
          entryId:    id,
          reflection: reflection.trim(),
        }).catch(() => {});
      }
    };
  }, [reflection, id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Done button: flush save then go home ─────────────────────────────────
  async function handleDone() {
    clearTimeout(saveTimerRef.current);
    if (reflection.trim() && reflection !== lastSavedRef.current) {
      await doSave(reflection);
    }
    navigate("/home");
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 relative overflow-hidden">

      {/* ── Ambient blobs ── */}
      <div className="absolute top-0 right-[-10%] w-72 h-72 rounded-full bg-bloom-lavender/22 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-60 h-60 rounded-full bg-bloom-cream/50 blur-3xl pointer-events-none" />

      {/* ── Back ── */}
      <motion.button
        {...FADE_UP}
        onClick={() => navigate(-1)}
        className="self-start mb-7 font-sans text-sm text-bloom-ink/45
          hover:text-bloom-ink/75 transition-colors"
      >
        ← Back
      </motion.button>

      <div className="max-w-sm w-full mx-auto flex flex-col gap-6 flex-1">

        {/* ── Header ── */}
        <motion.div {...FADE_UP} className="text-center flex flex-col items-center gap-2">
          <span className="text-4xl">🌙</span>
          <h1 className="font-serif text-hero text-bloom-ink italic">Reflect</h1>
          <p className="font-sans text-sm text-bloom-ink/50">
            Let your thoughts breathe.
          </p>
        </motion.div>

        {/* ── Prompt card ── */}
        {promptText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-slip p-5 flex flex-col gap-2"
          >
            <p className="font-sans text-xs text-bloom-ink/38 uppercase tracking-wider">
              Your prompt
            </p>
            <p className="font-serif italic text-bloom-ink/80 leading-relaxed">
              {promptText}
            </p>
          </motion.div>
        )}

        {/* ── Textarea ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-glass p-5 flex flex-col gap-3 flex-1"
        >
          {/* Toolbar row */}
          <div className="flex items-center justify-between">
            <p className="font-sans text-xs text-bloom-ink/38 uppercase tracking-wider">
              Your reflection
            </p>

            <div className="flex items-center gap-3">
              {/* Saving indicator */}
              <AnimatePresence mode="wait">
                {saving && (
                  <motion.span
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="font-sans text-xs text-bloom-ink/30"
                  >
                    Saving…
                  </motion.span>
                )}
                {saved && !saving && (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-sans text-xs text-bloom-purple/55"
                  >
                    Saved ✓
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Word count */}
              {wordCount > 0 && (
                <span className="font-sans text-xs text-bloom-ink/22 tabular-nums">
                  {wordCount}w
                </span>
              )}
            </div>
          </div>

          <textarea
            value={reflection}
            onChange={handleChange}
            placeholder={PLACEHOLDER}
            autoFocus
            className="w-full min-h-[200px] flex-1 bg-transparent resize-none
              font-sans text-sm text-bloom-ink leading-relaxed
              placeholder:text-bloom-ink/22
              focus:outline-none"
          />
        </motion.div>

        {/* ── Gratitude echo (first line from slip) ── */}
        {selectedEntry && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-center font-serif italic text-bloom-ink/28 text-sm leading-relaxed"
          >
            "{selectedEntry}"
          </motion.p>
        )}

        {/* ── Done ── */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          onClick={handleDone}
          className="w-full py-4 rounded-2xl bg-bloom-purple text-white font-sans
            font-medium shadow-bloom transition-all
            hover:bg-bloom-ink active:scale-[0.98] mb-4"
        >
          Done reflecting 🌸
        </motion.button>

      </div>
    </div>
  );
}
