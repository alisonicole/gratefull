// src/components/entry/MoodTagPicker.jsx
import { motion } from "framer-motion";
import { MOOD_TAGS } from "@/lib/constants";

/**
 * MoodTagPicker — tap an emoji chip to select a mood.
 *
 * @param {string|null} selected   currently selected mood key
 * @param {function}    onSelect   (key) => void  — passes null if deselected
 */
export default function MoodTagPicker({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOOD_TAGS.map((tag) => {
        const active = selected === tag.key;
        return (
          <motion.button
            key={tag.key}
            onClick={() => onSelect(active ? null : tag.key)}
            whileTap={{ scale: 0.90 }}
            animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
            className={[
              "flex items-center gap-1.5 px-3.5 py-2 rounded-full",
              "text-sm font-sans border transition-all duration-200",
              active
                ? "bg-bloom-purple text-white border-bloom-purple shadow-bloom"
                : "bg-white/55 text-bloom-ink/65 border-bloom-lavender/40 hover:border-bloom-purple/40 hover:bg-white/80",
            ].join(" ")}
          >
            <span className="text-base leading-none">{tag.emoji}</span>
            <span className={active ? "font-medium" : ""}>{tag.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
