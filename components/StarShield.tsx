import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { starshield, whatsappLink } from "@/content/site";

/* Seção StarShield — grade vertical de cards de tema CLARO (fundo branco/cinza,
   texto escuro = token `bg`), sobre o site escuro. Server component, sem JS.
   Imagens com next/image `fill` + object-cover -> preenchem todo o painel. */
export function StarShield() {
  const { hero, duo, wide, cta } = starshield;

  return (
    <section className="px-[var(--layout-margin)] py-[var(--layout-padding-y)]">
      <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-col gap-6">
        {/* ---------- Card hero (full width, 2 lados, altura menor) ---------- */}
        <div className="group relative grid grid-cols-1 overflow-hidden rounded-big border border-white-8 bg-azul-escuro/40 transition duration-500 hover:z-10 hover:scale-[1.03] hover:bg-azul-capri/15 md:grid-cols-2">
          <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
            <h3 className="text-h3 md:text-h2 max-w-[16ch] font-medium text-white">
              {hero.title}
            </h3>
            <a href={hero.cta.href} className="btn-link">
              {hero.cta.label}
              <ArrowUpRight className="size-4" strokeWidth={2.25} />
            </a>
          </div>
          <div className="relative min-h-[220px]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="rounded-medium object-cover"
            />
          </div>
        </div>

        {/* ---------- Segunda linha: 2 cards lado a lado ---------- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {duo.map((card) => (
            <article
              key={card.title}
              className="relative flex h-[420px] flex-col overflow-hidden rounded-big border border-white-8 bg-azul-escuro/40 transition duration-500 hover:z-10 hover:scale-[1.03] hover:bg-azul-capri/15"
            >
              <div className="p-8">
                <h3 className="text-h3 font-medium text-white">{card.title}</h3>
                <p className="text-body2 mt-2 max-w-[44ch] text-white/60">
                  {card.description}
                </p>
              </div>
              {/* imagem preenche toda a área inferior do card */}
              <div className="relative mt-auto w-full flex-1">
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="rounded-medium object-cover"
                />
              </div>
            </article>
          ))}
        </div>

        {/* ---------- Cards largos (Matte, Limpa telas) ---------- */}
        {wide.map((card) => (
          <div
            key={card.title}
            className="relative grid grid-cols-1 overflow-hidden rounded-big border border-white-8 bg-azul-escuro/40 transition duration-500 hover:z-10 hover:scale-[1.03] hover:bg-azul-capri/15 md:grid-cols-2"
          >
            <div className="flex flex-col justify-center gap-2 p-8 md:p-12">
              <h3 className="text-h3 font-medium text-white">{card.title}</h3>
              <p className="text-body2 max-w-[48ch] text-white/60">
                {card.description}
              </p>
            </div>
            <div className="relative min-h-[240px]">
              <Image
                src={card.image.src}
                alt={card.image.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="rounded-medium object-cover"
              />
            </div>
          </div>
        ))}

        {/* ---------- CTA ---------- */}
        <div className="mt-10 flex justify-center">
          <a
            href={whatsappLink(cta.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
