/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bloom: {
          peach:    "#F2A28A",
          lavender: "#C9B8E8",
          blush:    "#F7C5C0",
          cream:    "#FAE8D4",
          lilac:    "#DEC5EC",
          coral:    "#E8745A",
          white:    "#FDFAF8",
          purple:   "#7B5EA7",
          ink:      "#3D2E4E",
        },
        glow: { amber: "#FCEBD4" },
      },
      fontFamily: {
        serif:  ["Cormorant Garamond", "Georgia", "serif"],
        script: ["Dancing Script", "cursive"],
        sans:   ["DM Sans", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-peach-lavender": "linear-gradient(135deg, #FAE8D4 0%, #F7C5C0 50%, #C9B8E8 100%)",
        "gradient-lilac-cream":    "linear-gradient(135deg, #DEC5EC 0%, #FAE8D4 100%)",
        "gradient-coral-purple":   "linear-gradient(135deg, #F2A28A 0%, #7B5EA7 100%)",
        "gradient-blush-lilac":    "linear-gradient(135deg, #F7C5C0 0%, #DEC5EC 100%)",
      },
      animation: {
        "float":      "float 3s ease-in-out infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
        "slip-in":    "slipIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "fade-up":    "fadeUp 0.4s ease-out forwards",
      },
      keyframes: {
        float:     { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        glowPulse: { "0%, 100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        slipIn:    { "0%": { transform: "translateY(-40px) rotate(-8deg)", opacity: "0" }, "100%": { transform: "translateY(0px) rotate(0deg)", opacity: "1" } },
        fadeUp:    { "0%": { transform: "translateY(8px)", opacity: "0" }, "100%": { transform: "translateY(0px)", opacity: "1" } },
      },
      boxShadow: {
        bloom: "0 8px 32px rgba(201, 184, 232, 0.3)",
        glow:  "0 0 40px rgba(252, 235, 212, 0.6)",
      },
      borderRadius: { "4xl": "2rem" },
      fontSize: {
        display: ["3.5rem", { lineHeight: "1.1", fontWeight: "300" }],
        hero:    ["2.5rem", { lineHeight: "1.2", fontWeight: "300" }],
      },
    },
  },
};