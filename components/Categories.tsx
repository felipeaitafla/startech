import Image from "next/image";
import { categories } from "@/content/site";
import { WhatsAppButton } from "./WhatsAppButton";

/* Seção Categories — painel único full-width "iPhones seminovos": 2 colunas
   (texto à esquerda, imagem à direita), centralizadas vertical. CTA = botão pill
   (WhatsAppButton). No mobile empilha (texto em cima, imagem embaixo).
   Server component, dentro do grid 1200px. Copy em `content/site.ts`. */
export function Categories() {
  const panel = categories.panels[0]; // iPhones seminovos (card de novos removido)

  return (
    <section className="px-[var(--layout-margin)] py-[var(--layout-padding-y)]">
      <div className="mx-auto w-full max-w-[var(--layout-max)]">
        <div className="group grid grid-cols-1 items-center overflow-hidden rounded-big border border-white-8 bg-azul-escuro/40 transition duration-500 ease-in-out hover:scale-[1.02] hover:bg-azul-capri/15 md:grid-cols-2">
          {/* texto — esquerda */}
          <div className="flex flex-col items-start p-8 text-left md:p-12">
            <h2 className="text-h3 md:text-h2 font-bold text-white">
              {panel.title}
            </h2>
            <p className="text-body2 mt-4 max-w-[52ch] text-white/63">
              {panel.description}
            </p>
            <div className="mt-8">
              <WhatsAppButton
                message={panel.cta.message}
                label={panel.cta.label}
              />
            </div>
          </div>

          {/* imagem — direita (mesmo design das fotos da StarShield: inset p-4 +
              rounded-medium + object-cover) */}
          <div className="p-4">
            <Image
              src={panel.image.src}
              alt={panel.image.alt}
              width={560}
              height={440}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-[340px] w-full rounded-medium object-cover md:h-[440px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
