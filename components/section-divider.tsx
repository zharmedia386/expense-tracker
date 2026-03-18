export function SectionDivider() {
  return (
    <div className="relative w-full overflow-hidden" aria-hidden="true">
      {/* Subtle ambient glow behind the line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[60px] bg-[#7b39fc]/10 rounded-full blur-[60px]" />

      {/* The same gradient line style used at the top of the footer */}
      <div className="relative mx-auto w-2/3 h-px bg-gradient-to-r from-transparent via-[#7b39fc]/40 to-transparent" />

      {/* Extra shimmer layer for depth */}
      <div className="absolute inset-0 mx-auto w-1/3 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent blur-[1px]" />
    </div>
  )
}
