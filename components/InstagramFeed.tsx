import { instagram } from "@/content/site";

/* Posts hardcoded (placeholder) — preparado p/ futura integração com API.
   Cada item tem a forma que o endpoint deve devolver: { id, imageUrl, postUrl }. */
// TODO: substituir por fetch ao endpoint do Behold
const instagramPosts = [
  {
    id: 1,
    imageUrl: "https://picsum.photos/300/300?random=1",
    postUrl: "https://instagram.com/startechcelulares",
  },
  {
    id: 2,
    imageUrl: "https://picsum.photos/300/300?random=2",
    postUrl: "https://instagram.com/startechcelulares",
  },
  {
    id: 3,
    imageUrl: "https://picsum.photos/300/300?random=3",
    postUrl: "https://instagram.com/startechcelulares",
  },
  {
    id: 4,
    imageUrl: "https://picsum.photos/300/300?random=4",
    postUrl: "https://instagram.com/startechcelulares",
  },
  {
    id: 5,
    imageUrl: "https://picsum.photos/300/300?random=5",
    postUrl: "https://instagram.com/startechcelulares",
  },
  {
    id: 6,
    imageUrl: "https://picsum.photos/300/300?random=6",
    postUrl: "https://instagram.com/startechcelulares",
  },
  {
    id: 7,
    imageUrl: "https://picsum.photos/300/300?random=7",
    postUrl: "https://instagram.com/startechcelulares",
  },
  {
    id: 8,
    imageUrl: "https://picsum.photos/300/300?random=8",
    postUrl: "https://instagram.com/startechcelulares",
  },
];

/* Seção Instagram — 2 lados centralizados verticalmente (esquerda ~35%, direita o
   resto). Esquerda: handle + título + 2 linhas de pills (sem clique). Direita: grade
   4×2 de imagens quadradas clicáveis (abrem o post em nova aba). Mobile: empilha e a
   grade vira 2 colunas. Server component (só links). Copy em `content/site.ts`;
   posts no array `instagramPosts` acima. */
export function InstagramFeed() {
  const { handle, title, tags } = instagram;

  return (
    <section className="px-[var(--layout-margin)] py-[var(--layout-padding-y)]">
      <div className="mx-auto grid w-full max-w-[var(--layout-max)] grid-cols-1 items-center gap-10 md:grid-cols-[35fr_65fr] md:gap-12">
        {/* ---------- Lado esquerdo: chamada + tags ---------- */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-body2 text-white/60">{handle}</span>
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
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir post ${post.id} no Instagram`}
              className="group relative aspect-square overflow-hidden rounded-medium border border-white-8"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- feed externo (placeholder p/ API) */}
              <img
                src={post.imageUrl}
                alt={`Post do Instagram da Startech ${post.id}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
