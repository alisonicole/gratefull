// src/pages/Onboarding.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Parse from "@/lib/parse";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// Science slide content
const SCIENCE_SLIDES = [
  {
    emoji: "🧠",
    heading: "21 days to a happier brain",
    body: "Writing three gratitudes daily for 21 days rewires your brain toward optimism — measurably increasing happiness and decreasing stress hormones.",
    source: "Shawn Achor, Harvard positive psychology research",
  },
  {
    emoji: "✨",
    heading: "25% more life satisfaction",
    body: "People who keep a gratitude journal report significantly higher life satisfaction, stronger relationships, and better sleep.",
    source: "Emmons & McCullough, Journal of Personality & Social Psychology",
  },
  {
    emoji: "🫙",
    heading: "Your dream life already exists",
    body: "Your jar fills with proof — real moments, real feelings — that the life you're building is already here, one slip at a time.",
    source: "From the Gratitude Jar practice",
  },
];

const SLIDE = {
  initial:    { opacity: 0, x: 40  },
  animate:    { opacity: 1, x: 0   },
  exit:       { opacity: 0, x: -40 },
  transition: { duration: 0.35, ease: "easeOut" },
};

const FADE_UP = {
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.4, ease: "easeOut" },
};

export default function Onboarding() {
  const [step, setStep]               = useState(0);
  // step 0 = welcome
  // step 1-3 = science slides
  // step 4 = name your jar
  // step 5 = notification opt-in
  // (submit happens at end of step 5)

  const [scienceIdx, setScienceIdx]   = useState(0);
  const [jarName, setJarName]         = useState("");
  const [jarOrganization]             = useState("single"); // could expose as a setting later
  const [notifTime, setNotifTime]     = useState("08:00");
  const [notifsOn, setNotifsOn]       = useState(true);
  const [loading, setLoading]         = useState(false);

  const user      = useAuthStore(s => s.user);
  const setUser   = useAuthStore(s => s.setUser);
  const showToast = useUIStore(s => s.showToast);
  const navigate  = useNavigate();

  function nextScience() {
    if (scienceIdx < SCIENCE_SLIDES.length - 1) {
      setScienceIdx(i => i + 1);
    } else {
      setStep(4); // move past science to jar naming
    }
  }

  async function handleFinish() {
    if (!jarName.trim()) {
      showToast("Give your jar a name first 🌸", "error");
      return;
    }
    setLoading(true);
    try {
      await Parse.Cloud.run("completeOnboarding", {
        jarName:         jarName.trim(),
        jarOrganization,
        notificationTime: notifsOn ? notifTime : null,
        timezone:        Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      // Refresh user object so isPro / onboardingComplete are current
      await user.fetch({ useMasterKey: false });
      setUser(user);
      navigate("/home");
    } catch (err) {
      showToast(err.message || "Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-peach-lavender flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Blobs */}
      <div className="absolute top-[-60px] right-[-40px] w-64 h-64 rounded-full bg-bloom-lavender/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-40px] left-[-60px] w-56 h-56 rounded-full bg-bloom-blush/40 blur-3xl pointer-events-none" />

      {/* Progress dots */}
      <div className="absolute top-8 flex gap-2">
        {[0, 1, 4, 5].map((s, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              (step === 0 && i === 0) ||
              (step >= 1 && step <= 3 && i === 1) ||
              (step === 4 && i === 2) ||
              (step === 5 && i === 3)
                ? "bg-bloom-purple w-5"
                : "bg-bloom-lavender/50"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── STEP 0: Welcome ── */}
        {step === 0 && (
          <motion.div key="welcome" {...FADE_UP}
            className="flex flex-col items-center text-center gap-8 max-w-sm w-full"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-7xl"
            >
              🫙
            </motion.div>
            <div className="flex flex-col gap-3">
              <h1 className="font-serif text-display text-bloom-ink italic">
                Hey, {user?.get("displayName") || "dreamer"} 🌸
              </h1>
              <p className="font-sans text-bloom-ink/70 text-lg leading-relaxed">
                Before we set up your jar, let us share a little about why this works.
              </p>
            </div>
            <Button onClick={() => setStep(1)} variant="primary" size="lg">
              Tell me more ✨
            </Button>
            <button
              onClick={() => setStep(4)}
              className="text-sm text-bloom-ink/40 font-sans hover:text-bloom-ink/60 transition-colors"
            >
              Skip to setup
            </button>
          </motion.div>
        )}

        {/* ── STEP 1–3: Science slides ── */}
        {step >= 1 && step <= 3 && (
          <motion.div key={`science-${scienceIdx}`} {...SLIDE}
            className="card-glass p-8 w-full max-w-sm flex flex-col gap-6"
          >
            <div className="flex flex-col items-center text-center gap-5">
              <span className="text-6xl">{SCIENCE_SLIDES[scienceIdx].emoji}</span>
              <h2 className="font-serif text-2xl text-bloom-ink italic leading-tight">
                {SCIENCE_SLIDES[scienceIdx].heading}
              </h2>
              <p className="font-sans text-bloom-ink/70 leading-relaxed">
                {SCIENCE_SLIDES[scienceIdx].body}
              </p>
              <p className="text-xs text-bloom-ink/40 font-sans italic">
                {SCIENCE_SLIDES[scienceIdx].source}
              </p>
            </div>

            {/* Slide dots */}
            <div className="flex justify-center gap-2">
              {SCIENCE_SLIDES.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === scienceIdx ? "bg-bloom-purple w-4" : "bg-bloom-lavender/50"
                  }`}
                />
              ))}
            </div>

            <Button onClick={nextScience} variant="primary" size="lg">
              {scienceIdx < SCIENCE_SLIDES.length - 1 ? "Next →" : "Set up my jar 🫙"}
            </Button>
          </motion.div>
        )}

        {/* ── STEP 4: Name your jar ── */}
        {step === 4 && (
          <motion.div key="jar-name" {...FADE_UP}
            className="card-glass p-8 w-full max-w-sm flex flex-col gap-6"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <span className="text-6xl">🫙</span>
              <h2 className="font-serif text-hero text-bloom-ink italic">
                Name your jar
              </h2>
              <p className="font-sans text-sm text-bloom-ink/60 leading-relaxed">
                This name will appear on your jar's label. Make it feel like yours.
              </p>
            </div>

            <Input
              label="Jar name"
              type="text"
              value={jarName}
              onChange={e => setJarName(e.target.value)}
              placeholder="My Dream Life Jar"
              maxLength={40}
              autoFocus
            />

            {/* Preview label */}
            {jarName && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-slip text-center py-4 px-6"
              >
                <p className="font-script text-xl text-bloom-purple">
                  {jarName}
                </p>
              </motion.div>
            )}

            <Button
              onClick={() => setStep(5)}
              variant="primary"
              size="lg"
              disabled={!jarName.trim()}
            >
              I love it →
            </Button>
          </motion.div>
        )}

        {/* ── STEP 5: Notification opt-in ── */}
        {step === 5 && (
          <motion.div key="notifications" {...FADE_UP}
            className="card-glass p-8 w-full max-w-sm flex flex-col gap-6"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <span className="text-6xl">🔔</span>
              <h2 className="font-serif text-hero text-bloom-ink italic">
                Daily reminders
              </h2>
              <p className="font-sans text-sm text-bloom-ink/60 leading-relaxed">
                Can we remind you to add to your jar each day? A gentle nudge keeps the practice alive.
              </p>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between card-slip px-5 py-4">
              <div>
                <p className="font-sans font-medium text-bloom-ink text-sm">
                  Daily reminder
                </p>
                <p className="font-sans text-xs text-bloom-ink/50 mt-0.5">
                  "Time to add to your gratitude jar!"
                </p>
              </div>
              <button
                onClick={() => setNotifsOn(v => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  notifsOn ? "bg-bloom-purple" : "bg-bloom-lavender/40"
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                  notifsOn ? "translate-x-7" : "translate-x-1"
                }`} />
              </button>
            </div>

            {/* Time picker — only shown if notifs on */}
            <AnimatePresence>
              {notifsOn && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Input
                    label="Reminder time"
                    type="time"
                    value={notifTime}
                    onChange={e => setNotifTime(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              onClick={handleFinish}
              variant="primary"
              size="lg"
              loading={loading}
            >
              {loading ? "Setting up your jar…" : "Open my jar 🫙"}
            </Button>

            {notifsOn === false && (
              <p className="text-center text-xs text-bloom-ink/40 font-sans">
                You can turn reminders on anytime in settings.
              </p>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}