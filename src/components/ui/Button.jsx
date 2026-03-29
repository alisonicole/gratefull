const VARIANTS = {
  primary: `bg-bloom-purple text-bloom-white font-sans font-medium
    hover:bg-bloom-coral active:scale-[0.98]
    shadow-bloom transition-all duration-200`,
  ghost: `bg-bloom-white/60 text-bloom-purple font-sans font-medium
    border border-bloom-lavender/50
    hover:bg-bloom-lavender/20 active:scale-[0.98]
    transition-all duration-200`,
  danger: `bg-red-400 text-white font-sans font-medium
    hover:bg-red-500 active:scale-[0.98]
    transition-all duration-200`,
};

const SIZES = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-2xl w-full",
};

export default function Button({
  children, variant = "primary", size = "md",
  loading = false, disabled = false,
  type = "button", onClick, className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2
        ${VARIANTS[variant]} ${SIZES[size]}
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}