// src/components/jar/JarCanvas.jsx
import { motion } from "framer-motion";

/**
 * JarCanvas — mason jar filled with confetti paper slips.
 * Each gratitude entry adds 3 slips in distinct bloom colours.
 *
 * @param {number}   entryCount  total entries saved (drives slip count)
 * @param {number}   streak      days streak (drives glow intensity)
 * @param {function} onTap       tap / click handler
 */

// 6 slip colours cycling through the bloom palette —
// every 3 consecutive slips (= 1 entry) get a distinct trio.
const SLIP_COLORS = [
  { fill: "#F7C5C0", stroke: "#E8745A" }, // blush
  { fill: "#C9B8E8", stroke: "#7B5EA7" }, // lavender
  { fill: "#F2A28A", stroke: "#E8745A" }, // peach
  { fill: "#DEC5EC", stroke: "#9B78C7" }, // lilac
  { fill: "#FAE8D4", stroke: "#F2A28A" }, // cream
  { fill: "#F7D4E8", stroke: "#C97AAA" }, // rose
];

// Deterministic jitter from index — same value every render
function jitter(seed, range) {
  const v = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return ((v - Math.floor(v)) - 0.5) * range;
}

// Build all slip descriptors up front so positions are stable
function buildSlips(count) {
  // Cap visual slips: 3 cols × 14 rows = 42 max (≈14 entries fills the jar)
  const total  = Math.min(count * 3, 42);
  const COL_X  = [34, 60, 86];   // three columns, x centres
  const BASE_Y = 163;            // bottom of interior
  const ROW_H  = 11;             // vertical step per row

  return Array.from({ length: total }, (_, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return {
      id:    i,
      cx:    COL_X[col] + jitter(i * 5,     8),
      cy:    BASE_Y - row * ROW_H + jitter(i * 5 + 1, 4),
      rot:   jitter(i * 5 + 2, 32),   // ±16 deg
      color: SLIP_COLORS[i % SLIP_COLORS.length],
    };
  });
}

export default function JarCanvas({ entryCount = 0, streak = 0, onTap }) {
  const glowIntensity = Math.min(streak / 7, 1);
  const slips = buildSlips(entryCount);

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer select-none"
      onClick={onTap}
      role="button"
      aria-label="Pull a slip from the jar"
    >
      {/* ── Streak glow halo ── */}
      {streak > 0 && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 65%, #C9B8E8 0%, #7B5EA7 40%, transparent 72%)",
            filter: "blur(36px)",
          }}
          animate={{
            opacity: [
              glowIntensity * 0.22,
              glowIntensity * 0.52,
              glowIntensity * 0.22,
            ],
            scale: [1, 1.07, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <svg
        viewBox="0 0 120 200"
        width="210"
        height="310"
        className="relative z-10"
        style={{ filter: "drop-shadow(0 12px 32px rgba(201,184,232,0.35))" }}
        aria-hidden
      >
        <defs>
          {/* Clip to jar interior */}
          <clipPath id="jar-interior">
            <path d="
              M 33,48 C 20,48 14,54 14,62
              L 14,168 C 14,175 20,180 28,180
              L 92,180 C 100,180 106,175 106,168
              L 106,62 C 106,54 100,48 87,48 Z
            " />
          </clipPath>

          {/* Glass sheen */}
          <linearGradient id="glass-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.28)" />
            <stop offset="35%"  stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.10)" />
          </linearGradient>

          {/* Lid gradient */}
          <linearGradient id="lid-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(242,162,138,0.55)" />
            <stop offset="100%" stopColor="rgba(232,116,90,0.35)"  />
          </linearGradient>
        </defs>

        {/* ══ CONFETTI SLIPS (clipped to jar) ══ */}
        <g clipPath="url(#jar-interior)">
          {slips.map((slip) => (
            <motion.g
              key={slip.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay:    Math.min(slip.id * 0.025, 0.6),
                duration: 0.45,
                ease:     [0.34, 1.56, 0.64, 1],
              }}
            >
              <rect
                x={slip.cx - 13}
                y={slip.cy - 4.5}
                width="26"
                height="9"
                rx="2.5"
                fill={slip.color.fill}
                stroke={slip.color.stroke}
                strokeWidth="0.7"
                strokeOpacity="0.45"
                transform={`rotate(${slip.rot} ${slip.cx} ${slip.cy})`}
              />
              {/* Tiny line on slip to suggest writing */}
              <line
                x1={slip.cx - 7}
                y1={slip.cy + 0.5}
                x2={slip.cx + 7}
                y2={slip.cy + 0.5}
                stroke={slip.color.stroke}
                strokeWidth="0.8"
                strokeOpacity="0.3"
                strokeLinecap="round"
                transform={`rotate(${slip.rot} ${slip.cx} ${slip.cy})`}
              />
            </motion.g>
          ))}
        </g>

        {/* ══ JAR BODY ══ */}

        {/* Base band */}
        <rect
          x="14" y="170" width="92" height="14" rx="7"
          fill="rgba(201,184,232,0.18)"
          stroke="rgba(201,184,232,0.55)"
          strokeWidth="1.5"
        />

        {/* Main body outline */}
        <path
          d="
            M 33,48 C 20,48 14,54 14,62
            L 14,168 C 14,175 20,182 28,182
            L 92,182 C 100,182 106,175 106,168
            L 106,62 C 106,54 100,48 87,48 Z
          "
          fill="rgba(253,250,248,0.06)"
          stroke="rgba(201,184,232,0.65)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Glass sheen overlay */}
        <path
          d="
            M 33,48 C 20,48 14,54 14,62
            L 14,168 C 14,175 20,182 28,182
            L 92,182 C 100,182 106,175 106,168
            L 106,62 C 106,54 100,48 87,48 Z
          "
          fill="url(#glass-sheen)"
          stroke="none"
        />

        {/* Left highlight streaks */}
        <line x1="24" y1="64" x2="24" y2="164"
          stroke="rgba(255,255,255,0.50)" strokeWidth="3" strokeLinecap="round" />
        <line x1="31" y1="64" x2="31" y2="158"
          stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />

        {/* ══ NECK / SHOULDER ══ */}
        <path
          d="M 33,24 L 14,50 L 106,50 L 87,24 Z"
          fill="rgba(242,162,138,0.14)"
          stroke="rgba(232,116,90,0.38)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* ══ LID ══ */}
        <rect x="29" y="10" width="62" height="16" rx="5"
          fill="url(#lid-grad)"
          stroke="rgba(232,116,90,0.50)"
          strokeWidth="1.5"
        />
        <rect x="24" y="4" width="72" height="8" rx="4"
          fill="rgba(242,162,138,0.24)"
          stroke="rgba(232,116,90,0.42)"
          strokeWidth="1.5"
        />
        <rect x="33" y="11" width="26" height="3" rx="1.5"
          fill="rgba(255,255,255,0.44)"
        />
      </svg>
    </div>
  );
}
