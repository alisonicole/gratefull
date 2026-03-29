// src/pages/Science.jsx
import { motion } from "framer-motion";

const RESEARCH = [
  {
    emoji:   "🧠",
    heading: "21 days to a happier brain",
    body:    "Writing three gratitudes daily for 21 days measurably rewires your brain toward optimism. Participants showed significant increases in happiness scores and decreases in cortisol — the primary stress hormone — sustained for months after the practice ended.",
    source:  "Shawn Achor — Harvard positive psychology research, 2011",
    color:   "bg-bloom-lavender/20",
    border:  "border-bloom-lavender/40",
  },
  {
    emoji:   "✨",
    heading: "25% more life satisfaction",
    body:    "People who keep a gratitude journal report significantly higher life satisfaction, stronger relationships, better sleep quality, and fewer visits to physicians compared to those who journal about daily hassles or neutral events.",
    source:  "Emmons & McCullough — Journal of Personality & Social Psychology, 2003",
    color:   "bg-bloom-blush/20",
    border:  "border-bloom-blush/40",
  },
  {
    emoji:   "💤",
    heading: "Deeper, longer sleep",
    body:    "Spending just 15 minutes writing about what you're grateful for before bed helped participants fall asleep faster and sleep longer. Gratitude quiets the \"busy mind\" loop that keeps people awake by shifting focus from worries to positive experiences.",
    source:  "Wood, Joseph & Lloyd — Journal of Experimental Social Psychology, 2009",
    color:   "bg-bloom-peach/20",
    border:  "border-bloom-peach/50",
  },
  {
    emoji:   "🤝",
    heading: "Stronger relationships",
    body:    "Expressing gratitude — even privately in a journal — strengthens your sense of connection to others. Studies show grateful people feel less lonely, are more likely to reach out for support, and report higher relationship satisfaction.",
    source:  "Algoe, Haidt & Gable — Emotion Journal, 2008",
    color:   "bg-bloom-lilac/20",
    border:  "border-bloom-lilac/50",
  },
  {
    emoji:   "💪",
    heading: "More resilience under stress",
    body:    "After the 9/11 attacks, people high in gratitude showed significantly lower rates of depression and PTSD. Gratitude acts as an emotional buffer — it doesn't erase hardship but builds the inner resources to meet it.",
    source:  "Fredrickson et al. — Journal of Personality & Social Psychology, 2003",
    color:   "bg-bloom-cream/60",
    border:  "border-bloom-lavender/30",
  },
  {
    emoji:   "🫙",
    heading: "Your dream life already exists",
    body:    "The Gratitude Jar practice turns abstract positivity into tangible evidence. Every slip is proof — real moments, real feelings — that the life you're building is already here. Over time, the jar becomes a physical record of your own becoming.",
    source:  "From the Gratitude Jar practice",
    color:   "bg-bloom-lavender/10",
    border:  "border-bloom-purple/25",
  },
];

const FADE_UP = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.45, ease: "easeOut" },
};

export default function Science() {
  return (
    <div className="min-h-screen flex flex-col px-6 py-10 relative overflow-hidden">

      {/* Blobs */}
      <div className="absolute top-0 right-[-10%] w-72 h-72 rounded-full bg-bloom-lavender/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-[-15%] w-64 h-64 rounded-full bg-bloom-blush/18 blur-3xl pointer-events-none" />

      <div className="max-w-sm w-full mx-auto flex flex-col gap-7">

        {/* Header */}
        <motion.div {...FADE_UP} className="text-center flex flex-col items-center gap-3 pt-2">
          <motion.span
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl"
          >
            🔬
          </motion.span>
          <h1 className="font-serif text-hero text-bloom-ink italic leading-tight">
            Why it works
          </h1>
          <p className="font-sans text-sm text-bloom-ink/50 leading-relaxed text-center max-w-[260px]">
            Decades of research explain what happens when you make gratitude a daily practice.
          </p>
        </motion.div>

        {/* Research cards */}
        <div className="flex flex-col gap-5">
          {RESEARCH.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.07, duration: 0.45, ease: "easeOut" }}
              className={`rounded-2xl border p-5 flex flex-col gap-3 ${item.color} ${item.border}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0 mt-0.5">{item.emoji}</span>
                <h2 className="font-serif italic text-bloom-ink text-xl leading-snug">
                  {item.heading}
                </h2>
              </div>

              <p className="font-sans text-sm text-bloom-ink/75 leading-relaxed">
                {item.body}
              </p>

              <p className="font-sans text-xs text-bloom-ink/38 italic border-t border-bloom-lavender/20 pt-2">
                {item.source}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer nudge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center font-serif italic text-bloom-ink/32 text-sm leading-relaxed pb-4"
        >
          "Small moments hold the most light."
        </motion.p>

      </div>
    </div>
  );
}
