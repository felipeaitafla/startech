/* Logo textual STAR / TECH — aproximação em Arboria Bold itálico.
   TODO: substituir pelo SVG/lettering oficial quando disponível. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`select-none text-center font-bold uppercase italic leading-[0.82] tracking-[-0.04em] text-white ${className}`}
      aria-label="Star Tech"
    >
      <span className="block text-[20px] md:text-[22px]">Star</span>
      <span className="block text-[20px] md:text-[22px]">Tech</span>
    </span>
  );
}
