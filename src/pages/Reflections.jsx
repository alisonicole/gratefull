// src/pages/Reflections.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Parse from "@/lib/parse";

const FADE_UP = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.45, ease: "easeOut" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function ReflectionCard({ reflection, index }) {
  const [expanded, setExpanded] = useState(false);

  // Normalise field names — saveReflection may use "text" or "reflection"
  const text    = reflection.get("text") ?? reflection.get("reflection") ?? reflection.get("body") ?? "";
  const entry   = reflection.get("entry");
  // Pull one entry line from the linked GratitudeEntry to use as context
  const entryLine = entry?.get("entry1") ?? "";
  const date    = formatDate(reflection.get("createdAt") ?? reflection.createdAt);
  const preview = text.length > 120 ? text.slice(0, 120).trimEnd() + "…" : text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="card-glass p-5 flex flex-col gap-3"
    >
      {/* Date */}
      <p className="font-sans text-xs text-bloom-ink/38 uppercase tracking-wider">
        {date}
      </p>

      {/* Entry echo */}
      {entryLine && (
        <p className="font-serif italic text-bloom-purple/70 text-sm leading-relaxed border-l-2 border-bloom-lavender/40 pl-3">
          "{entryLine}"
        </p>
      )}

      {/* Reflection body */}
      <AnimatePresence initial={false} mode="wait">
        {expanded ? (
          <motion.p
            key="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-sans text-sm text-bloom-ink/80 leading-relaxed whitespace-pre-wrap"
          >
            {text}
          </motion.p>
        ) : (
          <motion.p
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-sans text-sm text-bloom-ink/80 leading-relaxed"
          >
            {preview}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Expand / collapse toggle */}
      {text.length > 120 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="self-start font-sans text-xs text-bloom-purple/60
            hover:text-bloom-purple transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </motion.div>
  );
}

export default function Reflections() {
  const navigate = useNavigate();

  const [reflections, setReflections] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [empty, setEmpty]             = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await Parse.User.currentAsync();
        if (!currentUser) return;
        const sessionToken = currentUser.getSessionToken();

        const query = new Parse.Query("Reflection");
        query.equalTo("user", currentUser);
        query.include("entry");
        query.descending("createdAt");
        query.limit(50);

        const results = await query.find({ sessionToken });
        setReflections(results);
        setEmpty(results.length === 0);
      } catch (e) {
        console.error("Reflections load error:", e);
        setEmpty(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 relative overflow-hidden">

      {/* Blobs */}
      <div className="absolute top-0 right-[-10%] w-64 h-64 rounded-full bg-bloom-lavender/22 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-56 h-56 rounded-full bg-bloom-blush/22 blur-3xl pointer-events-none" />

      {/* Back */}
      <motion.button
        {...FADE_UP}
        onClick={() => navigate(-1)}
        className="self-start mb-7 font-sans text-sm text-bloom-ink/45
          hover:text-bloom-ink/75 transition-colors"
      >
        ← Back
      </motion.button>

      <div className="max-w-sm w-full mx-auto flex flex-col gap-6">

        {/* Header */}
        <motion.div {...FADE_UP} className="text-center flex flex-col items-center gap-2">
          <span className="text-4xl">📖</span>
          <h1 className="font-serif text-hero text-bloom-ink italic">My Reflections</h1>
          <p className="font-sans text-sm text-bloom-ink/45">
            Your private journal, one slip at a time.
          </p>
        </motion.div>

        {/* States */}
        {loading && (
          <div className="flex flex-col gap-4 mt-2">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
                className="h-32 bg-bloom-lavender/15 rounded-2xl"
              />
            ))}
          </div>
        )}

        {!loading && empty && (
          <motion.div
            {...FADE_UP}
            className="card-slip p-8 text-center flex flex-col items-center gap-4 mt-4"
          >
            <span className="text-4xl">🌱</span>
            <p className="font-serif italic text-bloom-ink/60 leading-relaxed">
              Your reflections will appear here after you pull a slip and write.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="font-sans text-sm text-bloom-purple hover:text-bloom-ink transition-colors"
            >
              Go to my jar →
            </button>
          </motion.div>
        )}

        {!loading && !empty && (
          <div className="flex flex-col gap-4">
            {reflections.map((r, i) => (
              <ReflectionCard key={r.id} reflection={r} index={i} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
