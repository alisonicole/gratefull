export default function Input({
  label, type = "text", value, onChange,
  placeholder, required, disabled,
  minLength, maxLength, autoFocus, className = "",
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-sans font-medium text-bloom-ink/60 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        disabled={disabled} minLength={minLength}
        maxLength={maxLength} autoFocus={autoFocus}
        className={`w-full px-4 py-3 rounded-xl font-sans text-bloom-ink
          bg-bloom-white/70 border border-bloom-lavender/40
          placeholder:text-bloom-ink/30
          focus:outline-none focus:border-bloom-purple/60 focus:ring-2 focus:ring-bloom-purple/10
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 ${className}`}
      />
    </div>
  );
}