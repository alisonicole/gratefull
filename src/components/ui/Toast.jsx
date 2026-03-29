import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";

const STYLES = {
  success: "bg-bloom-purple text-bloom-white",
  error:   "bg-bloom-coral text-bloom-white",
  info:    "bg-bloom-lavender text-bloom-ink",
};

export default function Toast() {
  const toast = useUIStore(s => s.toast);
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-50
            px-5 py-3 rounded-2xl shadow-bloom font-sans text-sm font-medium
            whitespace-nowrap max-w-xs text-center
            ${STYLES[toast.type] || STYLES.info}`}
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}