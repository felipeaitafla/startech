import { Star, MapPin, type LucideIcon } from "lucide-react";
import { visit } from "@/content/site";
import { LojaCarousel } from "./LojaCarousel";

const itemIcons: Record<"star" | "location", LucideIcon> = {
  star: Star,
  location: MapPin,
};

/* Seção "Vem conhecer a Startech" — card arredondado (estilo do Footer:
   bg-azul-escuro/40 + border-white-8) com 2 colunas de largura igual:
   esquerda = título + lista (ícone + texto); direita = foto.
   Server component, dentro do grid 1200px. */
export function VisitStartech() {
  const { title, items, images } = visit;

  return (
    <section className="px-[var(--layout-margin)] py-[var(--layout-padding-y)]">
      <div className="mx-auto w-full max-w-[var(--layout-max)]">
        <div className="grid grid-cols-1 overflow-hidden rounded-big border border-white-8 bg-azul-escuro/40 md:grid-cols-2">
          {/* coluna esquerda — título + lista */}
          <div className="flex flex-col justify-center gap-8 px-10 py-8 md:px-16 md:py-12">
            <h2 className="text-h3 md:text-h2 font-bold text-white">{title}</h2>

            <ul className="flex flex-col gap-4">
              {items.map((item) => {
                const Icon = itemIcons[item.icon];
                return (
                  <li key={item.text} className="flex items-center gap-4">
                    <Icon
                      className="size-6 shrink-0 text-azul-capri"
                      strokeWidth={1.75}
                    />
                    <span className="text-lead text-white/73">{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* coluna direita — carrossel automático da loja (sem setas) */}
          <div className="p-4">
            <LojaCarousel slides={images} />
          </div>
        </div>
      </div>
    </section>
  );
}
