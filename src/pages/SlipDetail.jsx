// src/pages/SlipDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Parse from "@/lib/parse";
import { useUIStore } from "@/store/useUIStore";
import { MOOD_TAGS } from "@/lib/constants";

const FADE_UP = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.5, ease: "easeOut" },
};

// ── Skeleton shimmer bar ─────────────────────────────────────────────────────
function SkeletonBar({ className = "" }) {
  return (
    <motion.div
      animate={{ opacity: [0.35, 0.7, 0.35] }}
      transition={{ duration: 1.6, repeat: Infinity }}
      className={`h-4 bg-bloom-lavender/25 rounded-full ${className}`}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SlipDetail() {
  const { id }    = useParams();
  const location  = useLocation();
  const navigate  = useNavigate();
  const showToast = useUIStore(s => s.showToast);

  // Slip may arrive via navigate state (from Home) or must be fetched by id
  const [slip, setSlip]                 = useState(location.state?.slip ?? null);
  const selectedEntry                   = location.state?.selectedEntry ?? null;
  const [prompt, setPrompt]             = useState(null);
  const [loadingSlip, setLoadingSlip]   = useState(!location.state?.slip);
  const [loadingPrompt, setLoadingPrompt] = useState(false);

  // ── Fetch slip if not in state ───────────────────────────────────────────
  useEffect(() => {
    if (slip) return;
    async function fetchSlip() {
      try {
        const query = new Parse.Query("GratitudeEntry");
        const result = await query.get(id);
        setSlip(result.toJSON());
      } catch {
        showToast("Couldn't load this slip.", "error");
      } finally {
        setLoadingSlip(false);
      }
    }
    fetchSlip();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Generate AI journal prompt once slip is ready ───────────────────────
  useEffect(() => {
    if (!slip) return;
    async function generatePrompt() {
      setLoadingPrompt(true);
      try {
        const result = await Parse.Cloud.run("generateJournalPrompt", {
          entryId: slip.objectId ?? id,
          entry1:  slip.entry1,
          entry2:  slip.entry2,
          entry3:  slip.entry3,
        });
        setPrompt(result);
      } catch {
        // Non-fatal — show slip without AI prompt
      } finally {
        setLoadingPrompt(false);
      }
    }
    generatePrompt();
  }, [slip]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived values ───────────────────────────────────────────────────────
  // Show the single randomly-picked entry, falling back to entry1
  const entryText = selectedEntry ?? slip?.entry1 ?? "";
  const mood      = slip?.moodTag1;
  const slipId    = slip?.objectId ?? id;

  // Parse cloud functions may return createdAt as { __type: "Date", iso: "..." } or a plain string
  const rawCreatedAt = slip?.createdAt;
  const createdAtStr = rawCreatedAt?.iso ?? rawCreatedAt ?? null;
  const date = createdAtStr
    ? new Date(createdAtStr).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : null;

  // Normalise the prompt: it may be a string or an object
  const promptText = typeof prompt === "string"
    ? prompt
    : prompt?.prompt ?? prompt?.insight ?? null;

  // ── Loading state ────────────────────────────────────────────────────────
  if (loadingSlip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl"
        >
          🫙
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 relative overflow-hidden">

      {/* ── Ambient blobs ── */}
      <div className="absolute top-0 right-[-10%] w-64 h-64 rounded-full bg-bloom-lilac/28 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-56 h-56 rounded-full bg-bloom-peach/20 blur-3xl pointer-events-none" />

      {/* ── Back ── */}
      <motion.button
        {...FADE_UP}
        onClick={() => navigate(-1)}
        className="self-start mb-7 font-sans text-sm text-bloom-ink/45
          hover:text-bloom-ink/75 transition-colors"
      >
        ← Back
      </motion.button>

      <div className="max-w-sm w-full mx-auto flex flex-col gap-6">

        {/* ── Header ── */}
        <motion.div {...FADE_UP} className="text-center flex flex-col items-center gap-2">
          <motion.span
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl"
          >
            ✨
          </motion.span>
          <h1 className="font-serif text-hero text-bloom-ink italic">
            A slip from your jar
          </h1>
        </motion.div>

        {/* ── Slip card — falls in like a paper slip ── */}
        <motion.div
          initial={{ opacity: 0, y: -28, rotate: -5 }}
          animate={{ opacity: 1, y: 0,   rotate: 0  }}
          transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
          className="card-slip p-6 flex flex-col gap-4"
        >
          {/* Date stamped at the top of the slip */}
          {date && (
            <p className="font-sans text-xs text-bloom-ink/38 uppercase tracking-widest">
              {date}
            </p>
          )}

          {/* The gratitude itself */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-serif italic text-bloom-ink text-lg leading-relaxed"
          >
            {entryText}
          </motion.p>

          {/* Mood with emoji at the bottom */}
          {mood && (() => {
            const tag = MOOD_TAGS.find(t => t.key === mood);
            return (
              <div className="pt-3 border-t border-bloom-lavender/20 flex items-center gap-2">
                {tag && <span className="text-base">{tag.emoji}</span>}
                <p className="font-sans text-xs text-bloom-ink/45 italic">
                  Feeling {mood} that day
                </p>
              </div>
            );
          })()}
        </motion.div>

        {/* ── AI insight / journal prompt ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-glass p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💫</span>
            <p className="font-sans text-xs text-bloom-ink/45 uppercase tracking-wider">
              Reflection prompt
            </p>
          </div>

          {loadingPrompt ? (
            <div className="flex flex-col gap-2.5 pt-1">
              <SkeletonBar className="w-full" />
              <SkeletonBar className="w-4/5" />
              <SkeletonBar className="w-3/5" />
            </div>
          ) : promptText ? (
            <p className="font-serif italic text-bloom-ink/80 text-base leading-relaxed">
              {promptText}
            </p>
          ) : (
            <p className="font-sans text-sm text-bloom-ink/38 italic">
              Sit with this for a moment. What does it bring up for you?
            </p>
          )}
        </motion.div>

        {/* ── Actions ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() =>
              navigate(`/reflect/${slipId}`, { state: { slip, prompt, selectedEntry } })
            }
            className="w-full py-4 rounded-2xl bg-bloom-purple text-white font-sans
              font-medium shadow-bloom transition-all
              hover:bg-bloom-ink active:scale-[0.98]"
          >
            Reflect on this ✍️
          </button>

          <button
            onClick={() => navigate("/home")}
            className="w-full py-3.5 rounded-2xl border border-bloom-lavender/50
              font-sans text-sm text-bloom-ink/65 font-medium
              transition-all hover:bg-bloom-lavender/10 active:scale-[0.98]"
          >
            Back to my jar
          </button>
        </motion.div>

      </div>
    </div>
  );
}
