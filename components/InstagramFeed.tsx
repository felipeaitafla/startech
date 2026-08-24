import { Instagram } from "lucide-react";
import { instagram } from "@/content/site";

/* Posts vindos do Feedframer (proxy da API do Instagram). Busca SERVER-SIDE
   (a API key é secreta, fica em FEEDFRAMER_API_KEY — nunca exposta no client),
   com cache ISR de 1h. Doc: https://feedframer.com/docs/rest-api */
type FeedframerPost = {
  id: string;
  permalink: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  mediaType: string;
  altText: string | null;
  caption: string | null;
};

const POST_COUNT = 6;

async function getPosts(): Promise<FeedframerPost[]> {
  const key = process.env.FEEDFRAMER_API_KEY;
  if (!key) {
    // sem key (ex.: env não setada no host) -> fallback gracioso
    console.error("[InstagramFeed] FEEDFRAMER_API_KEY ausente — renderizando fallback.");
    return [];
  }
  try {
    const res = await fetch(
      `https://feedframer.com/api/v1/me?api_key=${key}&page[size]=${POST_COUNT}`,
      { next: { revalidate: 3600 } }, // revalida 1x/h; não bate na API a cada request
    );
    if (!res.ok) {
      console.error(`[InstagramFeed] Feedframer respondeu ${res.status} — fallback.`);
      return [];
    }
    const data = (await res.json()) as { posts?: FeedframerPost[] };
    return (data.posts ?? []).slice(0, POST_COUNT);
  } catch (err) {
    console.error("[InstagramFeed] falha ao buscar o feed:", err);
    return []; // rede/API fora do ar -> não quebra a página
  }
}

/* Seção Instagram — 2 lados centralizados verticalmente (esquerda ~35%, direita o
   resto). Esquerda: handle + título + 2 linhas de pills (sem clique). Direita: grade
   3×2 (desktop) / 2×3 (mobile) das fotos reais do feed (clicáveis, abrem o post em
   nova aba). Server component async. Copy em `content/site.ts` (`instagram`). */
export async function InstagramFeed() {
  const { handle, title, tags, profileUrl } = instagram;
  const posts = await getPosts();

  return (
    <section className="px-[var(--layout-margin)] py-[var(--layout-padding-y)]">
      <div className="mx-auto grid w-full max-w-[var(--layout-max)] grid-cols-1 items-center gap-10 md:grid-cols-[35fr_65fr] md:gap-12">
        {/* ---------- Lado esquerdo: chamada + tags ---------- */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body2 text-white/60 transition-colors ease-in-out hover:text-white"
            >
              {handle}
            </a>
            <h2 className="text-h3 md:text-h2 font-bold text-white">{title}</h2>
          </div>

          {/* duas linhas de pills (sem clique) */}
          <div className="flex flex-col gap-3">
            {tags.map((row, i) => (
              <div key={i} className="flex flex-wrap gap-3">
                {row.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white-8 bg-azul-escuro/40 px-4 py-2 text-body2 text-white/73"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Lado direito: grade de posts ---------- */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={post.caption?.slice(0, 80) || "Abrir post no Instagram"}
                className="group relative aspect-square overflow-hidden rounded-medium border border-white-8"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- feed externo (CDN do Instagram) */}
                <img
                  src={post.thumbnailUrl ?? post.mediaUrl}
                  alt={post.altText ?? "Publicação da Startech no Instagram"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        ) : (
          /* fallback gracioso (sem key / API fora): link pro perfil */
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex aspect-[2/1] items-center justify-center gap-3 rounded-big border border-white-8 bg-azul-escuro/40 text-white/73 transition-colors ease-in-out hover:text-white md:aspect-auto md:min-h-[280px]"
          >
            <Instagram className="size-6 text-azul-capri" />
            <span className="text-lead">Ver no Instagram</span>
          </a>
        )}
      </div>
    </section>
  );
}
