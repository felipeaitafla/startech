import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { acessorios, whatsappLink } from "@/content/site";

/* Seção Acessórios — bento grid de 4 imagens (só imagens, sem texto/overlay).
   Grade: 2 colunas iguais, 2 rows de altura definida, gap pequeno e uniforme.
   - card 1 (esq): ocupa as duas linhas → mais alto.
   - card 2 (dir, topo): largura total da coluna direita, 1 row.
   - cards 3 e 4 (dir, base): dividem o row inferior em 2 colunas iguais.
   Server component, Tailwind. */
export function Acessorios() {
  const { title, cta, images } = acessorios;

  return (
    <section className="px-[var(--layout-margin)] py-[var(--layout-padding-y)]">
      <div className="mx-auto w-full max-w-[var(--layout-max)]">
        {/* cabeçalho: título + CTA, centralizados */}
        <header className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-h3 md:text-h2 max-w-[20ch] font-bold text-white">
            {title}
          </h2>
          <a
            href={whatsappLink(cta.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-link"
          >
            {cta.label}
            <ArrowUpRight className="size-4" strokeWidth={2.25} />
          </a>
        </header>

        {/* bento grid */}
        <div className="mt-10 grid grid-cols-[35fr_65fr] grid-rows-[200px_200px] gap-3 sm:grid-rows-[270px_270px] lg:grid-rows-[340px_340px]">
          {/* card 1 — grande, coluna esquerda, ocupa as 2 linhas */}
          <div className="relative col-start-1 row-span-2 overflow-hidden rounded-big">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              sizes="(min-width: 1024px) 420px, 35vw"
              className="object-cover"
            />
          </div>

          {/* card 2 — coluna direita, row superior, largura total da coluna */}
          <div className="relative col-start-2 row-start-1 overflow-hidden rounded-big">
            <Image
              src={images[1].src}
              alt={images[1].alt}
              fill
              sizes="(min-width: 1024px) 780px, 65vw"
              className="object-cover"
            />
          </div>

          {/* row inferior direito — dividido em 2 colunas iguais (cards 3 e 4) */}
          <div className="col-start-2 row-start-2 grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden rounded-big">
              <Image
                src={images[2].src}
                alt={images[2].alt}
                fill
                sizes="(min-width: 1024px) 390px, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative overflow-hidden rounded-big">
              <Image
                src={images[3].src}
                alt={images[3].alt}
                fill
                sizes="(min-width: 1024px) 390px, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
