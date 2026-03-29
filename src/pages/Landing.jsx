// src/pages/Landing.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Parse from "@/lib/parse";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const FADE_UP = {
  initial:   { opacity: 0, y: 16 },
  animate:   { opacity: 1, y: 0  },
  exit:      { opacity: 0, y: -8 },
  transition:{ duration: 0.4, ease: "easeOut" },
};

export default function Landing() {
  const [mode, setMode]       = useState("hero");  // "hero" | "login" | "signup"
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);

  const setUser   = useAuthStore(s => s.setUser);
  const showToast = useUIStore(s => s.showToast);
  const navigate  = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      const user = new Parse.User();
      user.set("username", email.toLowerCase().trim());
      user.set("email",    email.toLowerCase().trim());
      user.set("password", password);
      user.set("displayName", name.trim().split(" ")[0]); // first name only
      user.set("avatarColor", randomAvatarColor());
      await user.signUp();
      setUser(user);
      navigate("/onboarding");
    } catch (err) {
      showToast(err.message || "Signup failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const user = await Parse.User.logIn(email.toLowerCase().trim(), password);
      setUser(user);
      // Skip onboarding if already complete
      const dest = user.get("onboardingComplete") ? "/home" : "/onboarding";
      navigate(dest);
    } catch (err) {
      showToast("Incorrect email or password.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-peach-lavender flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full bg-bloom-blush/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-40px] w-64 h-64 rounded-full bg-bloom-lavender/50 blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">

        {/* ── HERO ── */}
        {mode === "hero" && (
          <motion.div key="hero" {...FADE_UP} className="flex flex-col items-center text-center gap-8 max-w-sm w-full">

            {/* Jar illustration placeholder */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-8xl select-none"
            >
              🫙
            </motion.div>

            <div className="flex flex-col gap-3">
              <h1 className="font-serif text-display text-bloom-ink italic leading-tight">
                Gratefull
              </h1>
              <p className="font-script text-bloom-purple text-lg">
                A Gratitude Jar Practice
              </p>
              <p className="font-sans text-bloom-ink/70 text-lg leading-relaxed mt-1">
                Three things a day.<br />
                A jar full of your dream life.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Button onClick={() => setMode("signup")} variant="primary" size="lg">
                Begin my practice
              </Button>
              <Button onClick={() => setMode("login")} variant="ghost" size="lg">
                I already have a jar
              </Button>
            </div>

            {/* Social proof */}
            <p className="text-xs text-bloom-ink/40 font-sans">
              Rooted in positive psychology research ✨
            </p>
          </motion.div>
        )}

        {/* ── SIGN UP ── */}
        {mode === "signup" && (
          <motion.div key="signup" {...FADE_UP} className="card-glass p-8 w-full max-w-sm flex flex-col gap-6">
            <div>
              <button
                onClick={() => setMode("hero")}
                className="text-bloom-ink/40 text-sm font-sans mb-4 flex items-center gap-1 hover:text-bloom-ink/70 transition-colors"
              >
                ← back
              </button>
              <h2 className="font-serif text-hero text-bloom-ink italic">
                Create your jar
              </h2>
              <p className="text-sm text-bloom-ink/60 font-sans mt-1">
                It only takes a moment.
              </p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <Input
                label="First name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="What should we call you?"
                required
                autoFocus
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
              <Button type="submit" variant="primary" size="lg" loading={loading}>
                {loading ? "Creating your jar…" : "Create my jar ✨"}
              </Button>
            </form>

            <p className="text-center text-sm text-bloom-ink/50 font-sans">
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-bloom-purple underline underline-offset-2 hover:text-bloom-coral transition-colors"
              >
                Sign in
              </button>
            </p>
          </motion.div>
        )}

        {/* ── LOG IN ── */}
        {mode === "login" && (
          <motion.div key="login" {...FADE_UP} className="card-glass p-8 w-full max-w-sm flex flex-col gap-6">
            <div>
              <button
                onClick={() => setMode("hero")}
                className="text-bloom-ink/40 text-sm font-sans mb-4 flex items-center gap-1 hover:text-bloom-ink/70 transition-colors"
              >
                ← back
              </button>
              <h2 className="font-serif text-hero text-bloom-ink italic">
                Welcome back
              </h2>
              <p className="text-sm text-bloom-ink/60 font-sans mt-1">
                Your jar has been waiting. 🌸
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
              <Button type="submit" variant="primary" size="lg" loading={loading}>
                {loading ? "Opening your jar…" : "Open my jar"}
              </Button>
            </form>

            <p className="text-center text-sm text-bloom-ink/50 font-sans">
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-bloom-purple underline underline-offset-2 hover:text-bloom-coral transition-colors"
              >
                Sign up
              </button>
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// Assigns a soft pastel hex for the user's community avatar
function randomAvatarColor() {
  const colors = [
    "#F2A28A", "#C9B8E8", "#F7C5C0",
    "#DEC5EC", "#E8745A", "#7B5EA7",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}