import { finalCta } from "@/content/site";
import { highlight } from "@/lib/highlight";
import { WhatsAppButton } from "./WhatsAppButton";

/* CTA final — só título grande centralizado + botão, com bastante espaço em
   branco (padding vertical generoso). Server component, sem JS. */
export function FinalCta() {
  const { title, subtitle, cta } = finalCta;

  return (
    <section className="px-[var(--layout-margin)] py-[calc(var(--layout-padding-y)*1.15)]">
      <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col items-center gap-12 text-center md:gap-16">
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-h2 md:text-h1 max-w-[28ch] font-bold text-balance text-white">
            {title}
          </h2>
          <p className="text-lead max-w-[48ch] text-balance text-white/73">
            {highlight(subtitle, finalCta.subtitleHighlights)}
          </p>
        </div>
        <WhatsAppButton message={cta.message} label={cta.label} />
      </div>
    </section>
  );
}
