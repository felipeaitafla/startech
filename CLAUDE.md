# CLAUDE.md

> **Para o agente (Claude Code) — leia isto primeiro.**
> Este arquivo é a memória do projeto. **Leia-o no início de toda sessão**, antes de
> mexer em qualquer parte do site. E **atualize-o ao fim de qualquer mudança relevante**:
> nova seção criada, decisão de arquitetura, token de design novo/alterado, bug resolvido,
> pendência aberta ou fechada. Se este arquivo desatualizar, o contexto do projeto se perde.
> Atualizar o `CLAUDE.md` faz parte da tarefa — não é opcional.

---

## Objetivo

Recriar um site que já existia (feito em **Figma + Framer**) agora em **Next.js**, com
**ajustes de copy e layout** pelo caminho, e hospedar na **Netlify**. O resultado precisa
ser um código React/Next limpo, que a gente controla e edita à vontade — sem lock-in.

## Contexto / por que reconstruir do zero

- O site antigo roda no **Framer**, que **não exporta código utilizável** para Next.js
  (gera uma árvore de componentes proprietária; os "conversores" terceiros entregam código
  sujo e ainda acoplado ao CDN do Framer). Tentar reaproveitar esse código seria pior do que
  reconstruir, ainda mais porque vamos mudar copy e layout.
- **Fonte de verdade do design = Figma**, não o Framer.
- O **site Framer publicado** serve como referência de copy atual e de comportamento
  (animações, hover, responsividade).
- Reconstrução é **seção por seção**, não o site inteiro de uma vez.

## Stack / Arquitetura

- **Next.js 15** (App Router) + React 19 + TypeScript. Projeto já scaffoldado (setup manual,
  sem `create-next-app`, pra não brigar com os arquivos que já existiam).
- **Tailwind CSS v4** — config CSS-first via `@theme`. ⚠️ O `globals.css` agora vive em
  **`app/globals.css`** (não mais na raiz). PostCSS via `@tailwindcss/postcss`.
- **Fonte: Arboria** (self-hosted) carregada via **`next/font/local`** em `app/layout.tsx`,
  lendo os `.ttf` de **`/font`** (Book 400, Medium 500, Bold 700). Expõe `--font-arboria`,
  consumida por `--font-sans`. ⚠️ Os arquivos atuais são versão **"Demo for Personal Use"
  (ifonts.xyz)** — NÃO é a licença comercial; trocar antes de produção.
- **Animações: Framer Motion** (`framer-motion`). Variantes em `lib/anim.ts`
  (`stagger`, `floatUp`, `drift`). Estética "gravidade zero": spring de baixa rigidez
  (stiffness 58 / damping 17 / mass 0.9 — um pouco mais rápido que o original 42/16/1.1, mantendo
  a flutuação) + blur→nítido + bob (`drift`) contínuo.
  `MotionConfig reducedMotion="user"` em `components/MotionProvider.tsx` respeita
  "reduzir movimento" do SO.
- **Smooth scroll: Lenis** (`lenis`). Provider `components/SmoothScroll.tsx` (client, retorna
  `null`) inicializa o Lenis com perfil **"gravidade da lua"**: modo `lerp` baixo (`0.06`) → ao
  soltar a roda o scroll coasteia e "pousa" devagar (decaimento exponencial = pouso suave). CSS de
  apoio do Lenis fica no `globals.css`. Respeita "reduzir movimento" (não ativa → scroll nativo).
  A instância é exposta via `lib/lenis.ts` (`setLenis`/`scrollToTop`) p/ outros componentes
  scrollarem pelo mesmo motor — ex.: o **logo do Header volta ao topo** com `scrollToTop()`.
- **Ícones: `lucide-react`** (+ glyph WhatsApp inline no Header, que o lucide não tem).
- **Deploy:** em **teste na Vercel** (`startech-rho.vercel.app`); produção pretendida
  `startechcelulares.com.br`. Existe `netlify.toml` (plugin `@netlify/plugin-nextjs`) de quando o
  alvo era Netlify — ⚠️ decidir o host final. Git no GitHub: `felipeaitafla/startech` (`origin`,
  `main`). ⚠️ **Env vars no host:** `FEEDFRAMER_API_KEY` (feed Instagram) e `NEXT_PUBLIC_SITE_URL`.

## Estrutura de arquivos

- `app/layout.tsx` — html lang pt-BR, Arboria via next/font/local, MotionProvider, **metadata/SEO**
  (title + description + Open Graph + Twitter card + keywords; consts `SITE_TITLE`/`SITE_DESCRIPTION`).
  **Favicon** `public/icon.webp` (627×627; via `metadata.icons.icon`) + **apple-touch-icon**
  `public/icon.png` (`metadata.icons.apple` — PNG porque o iOS não renderiza webp p/ home screen)
  e **imagem OG/social** `public/social.png`
  (1200×630; **PNG de propósito** — webp em OG não é renderizado por vários crawlers, ex.: WhatsApp/Facebook).
  `metadataBase` = `NEXT_PUBLIC_SITE_URL` ou fallback **`https://startechcelulares.com.br`**
  (domínio de produção). Em teste na **Vercel** (`https://startech-rho.vercel.app`) — setar
  `NEXT_PUBLIC_SITE_URL` lá se quiser a OG correta no preview.
  Monta também `<div className="site-bg">` (fundo global fixo) como 1º filho do `<body>`, o
  `<SmoothScroll/>` (Lenis, smooth scroll global — não renderiza nada), o `<WhatsAppFloat/>`
  (botão flutuante de WhatsApp, fixo no canto inf. direito) e o `<CursorGlow/>` (cursor de luz
  laranja com rastro — canvas fixo, último filho).
- `app/page.tsx` — monta `<Header/>` + `<Hero/>` + `<FanCards/>` + `<Categories/>` + `<Partners/>` + `<Support/>` + `<StarShield/>` + `<StarcareLoyalty/>` + `<Acessorios/>` + `<InstagramFeed/>` + `<VisitStartech/>` + `<FinalCta/>` + `<Footer/>`. **Cada seção (menos Hero, FanCards e StarShield) é envolvida por `<Reveal>`** — entra na tela com a animação flutuante da Hero ao chegar no scroll (ver `Reveal.tsx`). A **StarShield** se auto-revela **em cascata** (stagger interno) e por isso fica fora do `<Reveal>`.
- `app/globals.css` — **fonte de verdade dos tokens** + base + `.btn*` + `.site-bg` (fundo global)
  + CSS de apoio do **Lenis** (`.lenis*`).
- `components/` — `Header.tsx`, `Hero.tsx`, `FanCards.tsx` (+ `FanCards.module.css`), `Categories.tsx`, `Partners.tsx`, `Support.tsx`, `StarShield.tsx`, `StarcareLoyalty.tsx`, `Acessorios.tsx`, `InstagramFeed.tsx`, `VisitStartech.tsx` (+ `LojaCarousel.tsx`), `FinalCta.tsx`, `Footer.tsx`, `WhatsAppFloat.tsx`, `WhatsAppButton.tsx`, `WhatsAppGlyph.tsx`, `Logo.tsx`, `MotionProvider.tsx`, `SmoothScroll.tsx`, `Reveal.tsx`, `CursorGlow.tsx`.
  - `CursorGlow` é o **cursor de luz** (client): `<canvas>` fixo em tela cheia (`pointer-events-none`,
    `z-[100]`, acima de tudo) — **substitui o cursor nativo** (esconde via classe `cursor-glow-active`
    no `<html>` + CSS `cursor: none` no `globals.css`) por um **brilho laranja + rastro**. Loop `rAF`:
    `head` persegue o mouse com lerp; **só deixa ponto quando a cabeça anda > `MIN_DIST`** (evita
    acúmulo/bolão com o mouse parado); pontos decaem (rastro que afina) desenhados como gradiente
    radial com `globalCompositeOperation="lighter"` (soma de luz) — **alphas/raios baixos e núcleo
    laranja (não branco)** p/ não saturar pro amarelo. Só ativa em **`pointer: fine`** (mouse) e
    respeita **"reduzir movimento"** (nesses casos o cursor nativo permanece). Knobs no topo:
    `COLOR` (#FF7A1A), `DECAY`, `LERP`, `MAX_POINTS`, `MIN_DIST`.
  - `Reveal` é o **wrapper de scroll-reveal** (client): `motion.div` com a variante `floatUp`
    (mesma entrada flutuante da Hero — sobe + escala + blur→nítido, spring gravidade-zero) disparada
    por **`whileInView`** (`viewport={{ once: true, amount: 0.2 }}` → anima 1× quando ~20% da seção
    aparece). Envolve cada seção no `page.tsx` como **unidade** (a seção inteira flutua pra dentro,
    não há stagger por elemento). Server components passam como children normalmente. ⚠️ **Hero**
    (já anima no load), **FanCards** (esteira contínua + peek de margem negativa) e **StarShield**
    (faz o próprio reveal em cascata) ficam **fora** do `<Reveal>`.
  - `WhatsAppGlyph` é a **fonte única** do ícone do WhatsApp (o lucide não tem): SVG inline
    `fill="currentColor"`. Consumido por `Header`/`WhatsAppFloat`/`Footer`/`WhatsAppButton`.
    **(2026-06-05) Glyph deixou de ser duplicado** — antes estava copiado em 3 lugares.
  - `WhatsAppButton` é o **CTA de WhatsApp** padrão: pill (`.btn`, ou `.btn .btn-sm` via `size="sm"`)
    com o `WhatsAppGlyph` num **círculo branco colado à esquerda** (`.btn-icon`) + rótulo. Abre o
    `wa.me` com a `message`. Props: `message`, `label`, `size`, `className`, `labelClassName`
    (ex.: `hidden sm:inline` no Header). Usado em Header (sm), Hero, Support, StarShield e FinalCta.
  - `InstagramFeed` é a seção **"Confira nosso Instagram"** (antes da VisitStartech): 2 lados no
    grid 1200px, centralizados vertical (`items-center`), **esquerda ~35% / direita o resto**
    (`md:grid-cols-[35fr_65fr]`); no **mobile empilha** (`grid-cols-1`). **Esquerda**: handle
    `@startechcelulares` (link pro perfil), título `text-h3 md:text-h2 font-bold`, e **2 linhas de
    pills** (sem clique: `rounded-full border border-white-8 bg-azul-escuro/40`). **Direita**: grade
    **3×2 desktop / 2×3 mobile** (`grid-cols-2 md:grid-cols-3 gap-3`) das **fotos reais do feed**
    (`aspect-square`, `rounded-medium`), cada uma um `<a target="_blank">` pro post (hover `scale-105`).
    **Server component ASYNC**: busca os **6 posts no Feedframer** (proxy da API do Instagram) em
    `getPosts()` — `fetch` server-side com a key **`FEEDFRAMER_API_KEY`** (env, **nunca no client**)
    + cache **ISR `revalidate: 3600`** (1h). Endpoint `feedframer.com/api/v1/me?api_key=…&page[size]=6`;
    campos usados: `id`/`permalink`/`mediaUrl`/`thumbnailUrl` (poster de vídeo)/`altText`/`caption`.
    **Fallback gracioso** se sem key/API fora: card "Ver no Instagram" pro perfil. `<img>` puro (CDN
    do Instagram — evita `remotePatterns`). Copy (handle/título/tags) em `content/site.ts` (`instagram`).
  - `VisitStartech` é a seção **"Vem conhecer a Startech"** (antes da FinalCta): **card
    arredondado** no estilo do Footer (`rounded-big` + `border-white-8` + `bg-azul-escuro/40`,
    `overflow-hidden`) com **2 colunas de largura igual** (`md:grid-cols-2`) dentro do grid 1200px.
    **Esquerda** (padding lateral maior: `px-10 py-8 md:px-16 md:py-12`): título
    `text-h3 md:text-h2 font-bold` + **lista** de 2 itens (ícone `lucide` solto em `azul-capri`,
    `size-6`, sem caixa + texto `text-lead` `text-white/73`) — `Star`/`MapPin` mapeados por chave
    `star`/`location`. **Direita**: **`LojaCarousel`** (client component) — carrossel **automático,
    sem setas**, crossfade (`opacity` 700ms) entre as fotos de `/public/loja`, troca a cada **2.3s**
    (`intervalMs`), respeita `prefers-reduced-motion`. Imagens `fill` + `object-cover` num wrapper
    `rounded-medium overflow-hidden` com `p-4` de inset, `min-h-[280px] md:min-h-[420px]`.
    **Imagens reais** da loja em `/public/loja` (`loja`/`close-up`/`fotos-clientes`).
    Server component. Copy: `visit` (incl. `visit.images`) em `content/site.ts`.
  - `FinalCta` é a **CTA final** (antes do Footer): **título grande centralizado**
    (`text-h2 md:text-h1 font-bold` + `text-balance` + `max-w-[28ch]` — largura folgada pra cair
    em **2 linhas**) + **lead** (`text-lead` `text-white/78`, agrupado ao título com `gap-5`) e
    **botão `.btn`** (link WhatsApp, msg "Olá, Startech!"), com **bastante respiro** — padding
    vertical `py-[calc(var(--layout-padding-y)*1.15)]` (1,15× o padrão) + `gap-12 md:gap-16` entre
    o bloco título/lead e o botão. Server component, dentro do grid 1200px. Copy em
    `content/site.ts` (`finalCta`).
  - `Footer` é a seção **final**: um **card**
    (`rounded-big` + `border-white-8` + `bg-azul-escuro/40` — fundo levemente diferente da página +
    padding `p-8 md:p-12`). O `<footer>` tem padding inferior **fixo `pb-12` (48px)** — menor que o
    `--layout-padding-y` padrão (decisão de aproximar o rodapé da base da página). Dentro, 3 colunas alinhadas ao centro vertical (`md:flex-row md:items-center
    md:justify-between`), que **empilham e centralizam no mobile** (`flex-col items-center`): **(1)** logo
    (`/startech-logo.png`, `h-12 md:h-14`); **(2)** contato — 3 itens com ícone `lucide`
    (`MapPin`/`Mail`/`Phone`, tint `azul-capri`) + texto `text-footer` `text-white/60` (email/telefone
    são links `mailto:`/`tel:`); **(3)** redes (WhatsApp glyph inline + Instagram/YouTube via `<img>`
    dos SVGs brancos, `size-6`) + copyright em 2 linhas `text-footer text-white/50`. Server component.
    ⚠️ O cliente pediu "4 colunas" mas só descreveu 3 — implementado com **3 colunas**.
    O glyph WhatsApp usa o `WhatsAppGlyph` compartilhado (não mais inline/duplicado).
  - `WhatsAppFloat` é o **botão flutuante de WhatsApp** (server component): `<a>` fixo
    `bottom-6 right-6 z-50`, círculo `size-14` verde `#25D366`, `WhatsAppGlyph` compartilhado,
    `hover:scale-110`. Mensagem fixa "Olá, Startech!". Montado no `layout.tsx`.
  - `Header` é **`fixed` no topo** com `bg-black/30 backdrop-blur-lg` + borda inferior `border-white-8`.
    Layout = **grid** (`grid-cols-1 md:grid-cols-3`). **Desktop (≥md), 3 colunas:** **redes sociais
    à esquerda** (`justify-self-start`; Instagram + YouTube via `<img>` dos SVGs `/insta.svg` e
    `/youtueb.svg`, **já em branco** — insta `fill` branco, youtube branco com o "play" vazado por
    `fill-rule="evenodd"`), **logo no centro** (`justify-self-center`), **botão WhatsApp à direita**
    (`justify-self-end`). **No MOBILE (<md): só o logo** (1 coluna; redes e CTA ficam `hidden
    md:flex` → `display:none` os tira do grid). ⚠️ Centralização por **`justify-self`, NÃO por
    `absolute`+`-translate-x-1/2`** — o transform do Tailwind conflitava com o `transform` inline
    do framer-motion (quebrava posição **e** o clique do logo). O **logo é um `<button>` que volta
    ao topo** (`scrollToTop` de `lib/lenis.ts`, scroll suave via Lenis). **Sem menu de navegação**
    — links e hambúrguer **removidos em definitivo** (não voltam); `nav` em `content/site.ts` tem só
    `social` + `cta`. O botão da direita é o `WhatsAppButton` (`size="sm"`, rótulo `hidden sm:inline`).
  - `Logo` usa o **logo oficial** `public/startech-logo.png` (PNG branco, transparente, 1249×600)
    via `next/image` (import estático). Altura `h-10 md:h-12` (default). **Usar esse arquivo daqui
    pra frente.** ⚠️ `Partners` (oculto) passa `className` com altura própria.
  - `FanCards` é a seção logo **abaixo da Hero**: leque 3D de imagens em **esteira infinita
    (marquee) p/ a direita**, lenta e contínua, com hover expand (no mobile o `:hover` dispara no
    toque). **Server component** (zero JS), **CSS Module** (`FanCards.module.css`). Camadas:
    `.fan` (recorta `overflow-x: clip`) > `.track` (esteira `animation: fanScroll 60s linear
    infinite`) > `.card`. **Perspectiva embutida em cada card** (`transform: perspective(2000px)
    rotateY(...)`) — **não** usa `perspective`/`preserve-3d` no pai, senão o hit-testing do `:hover`
    quebra. Lista **duplicada** (`[...images, ...images]`); a animação translada `-50% → 0` (= 1
    cópia) → loop seamless. Não pausa no hover (segue "sempre em movimento").
    **Responsivo por LARGURA** (breakpoints): card 290/230/180 + overlap −95/−85/−72 (desktop/
    tablet/mobile); peek `margin-top` −154/−142/0. **+ Responsivo por ALTURA:** como a Hero é
    `h-screen`, em viewports baixos ela encolhe e os bullets descem — então o peek é reduzido por
    `@media (min-width:768px) and (max-height:…)`: **−64px ≤820px** e **−8px ≤720px** (cobre
    1490×670 e laptops 1366×768) p/ não sobrepor os bullets. Mobile (≤767px) já tem peek 0.
  - `Categories` é a seção logo **abaixo do FanCards**: **painel único full-width** "iPhones
    seminovos" (o card de "iPhones novos" foi **removido a pedido**), dentro do **grid central de
    1200px** (`--layout-max`). Server component, Tailwind. Card `bg-azul-escuro/40` + `border-white-8`
    + `rounded-big` com **2 colunas** (`md:grid-cols-2`, `items-center`): **texto à esquerda**
    (título `text-h3 md:text-h2 font-bold` + descrição `text-body2` + **`WhatsAppButton`** "Comprar"
    — botão pill padrão, não mais o `.btn-link`) e **imagem à direita** (`object-contain`,
    `h-[340px] md:h-[440px]`). No mobile empilha (texto/imagem). **Hover no card**
    (`hover:scale-[1.02]` + `hover:bg-azul-capri/15`, `transition duration-500`) — visual, mas o
    clicável é o botão (o card não é mais link). Copy: `categories.panels[0]` em `content/site.ts`.
  - `Partners` ⚠️ **OCULTA** (comentada no `page.tsx` a pedido do cliente; componente mantido).
    É a seção **abaixo da Categories**: faixa "Trabalhamos com as melhores marcas".
    Server component, dentro do grid 1200px. **Logos ainda placeholder** (logo Startech repetida
    4x). Título em `text-body2` (15px) bold. ⚠️ Trocar pelos logos reais das marcas.
  - `Support` é a seção **abaixo da Partners**: "Assistência Técnica" com **carrossel de
    serviços**. **Client component** (`"use client"`, tem estado/navegação) — único carrossel
    com JS. Mostra 1/2/3 cards por view (mobile/tablet/desktop) via `matchMedia`; setas laterais
    com navegação **de 1 em 1 item**. **Loop infinito de verdade:** lista **triplicada**
    (clones nas pontas), índice começa no bloco do meio e ao fim da transição numa ponta
    "teleporta" sem animação pro item equivalente do centro → as **setas nunca desabilitam**,
    sem bolinhas. Cada card tem **fundo escuro** (`bg-azul-escuro/40` + `border-white-8` +
    `rounded-big`, igual StarShield), `p-6` (24px), texto full-width centralizado. CTA
    `WhatsAppButton` "Entrar em contato" (abre WhatsApp c/ msg de assistência técnica).
    **Imagens reais** em `/public/assistencia` (`tela`/`placa`/`bateria`/`transfere`/`pc`), casadas
    com os 5 serviços na copy (`content/site.ts`).
  - `StarShield` é a seção **abaixo do Support**: linha de proteções, **tema claro**. **Client
    component** (`"use client"`) p/ a **entrada em cascata**: o container interno é um `stagger`
    (`whileInView`, `viewport once amount 0.15`) e cada bloco (card hero, linha duo, cards wide,
    CTA) é um item `floatUp` — a linha **duo é um stagger aninhado** (os 2 cards entram em
    sequência). ⚠️ **Self-reveal:** NÃO envolver em `<Reveal>` no `page.tsx` (animaria 2×).
    Tailwind, dentro do grid 1200px. Cada card tem **fundo em gradiente** (classe
    `.ss-card` no `globals.css`: `linear-gradient(to top left, azul-capri/0.4, azul-capri/0.2)` —
    luz vindo de **baixo-direita**; base `0.4` (baixo) / `0.2` (topo), hover `0.6` / `0.33`) + `border-white-8` +
    `rounded-big`, **texto branco** (título `text-white`; descrição `text-white/73`). **Hover**:
    `scale-[1.02]` (transição na propriedade **`scale`** `0.5s ease-in-out` — igual às outras seções;
    ⚠️ Tailwind v4 usa `scale`, não `transform`) + gradiente **reluzente** (cores
    sobem p/ `0.6/0.4`) — as cores são custom props registradas via **`@property`** (`<color>`) p/ interpolarem
    suave; por isso os cards **não usam** a utility `transition` do Tailwind (a transição de transform
    + cores vive no próprio `.ss-card`). P/ ajustar, editar `.ss-card`. Layout = pilha de cards (`flex-col gap-6`): card **hero**
    full-width 2 colunas (texto + imagem) → linha **duo** (2 cards, texto em
    cima + imagem preenchendo a base) → cards **wide** (Matte, Capinhas: texto à esquerda +
    imagem à direita) → CTA `.btn` centralizado. Imagens via `next/image` `fill` + `object-cover`
    **todas na proporção original** (`width`/`height` intrínsecos vindos da copy, `w-full h-auto`,
    **sem `fill`/crop**), com inset `p-4` + `rounded-medium` (no duo: `px-4 pb-4`, topo já espaçado
    pelo texto; imagem ancorada na base por `mt-auto`). ⚠️ Cards duo **não têm mais altura fixa**
    (`h-[420px]` removido) — como as imagens têm proporções diferentes, o `grid` (`items-stretch`)
    iguala as alturas e o `mt-auto` cola a imagem na base.
    **Imagens reais** em `/public/starshield` (`intro` → hero; `pelicula` → Basic; `lens` → Lens;
    `matte` → Matte; `capinhas` → Capinhas). ⚠️ **Copy ainda provisória** (Basic/Lens/Matte).
    No **card hero** o título é "Proteja o seu aparelho com" + a **logo `starshield-logo.webp`**
    (em vez da palavra "StarShield"; `<Image>` `h-7 md:h-9 w-auto self-start` — o `self-start` evita
    o stretch horizontal no flex-col; alt="StarShield").
  - `Acessorios` é a seção **abaixo da StarcareLoyalty** (última): **bento grid** de 4 imagens
    (só imagens, sem texto/overlay/badge). Cabeçalho **centralizado** (título `text-h3 md:text-h2
    font-bold` + CTA `.btn-link` "Comprar ↗" — mesmo botão dos cards Categories; link WhatsApp).
    Grade no grid 1200px: colunas **35% / 65%**
    (`grid-cols-[35fr_65fr]`) + rows de altura fixa em **65%/35%** (topo maior):
    `grid-rows-[260px_140px]` → `sm:[351px_189px]` → `lg:[442px_238px]`, `gap-3` uniforme.
    **card 1** (esq) `row-span-2` = mais alto; **card 2** (dir, topo) 1 row largura total; **cards 3 e 4**
    num sub-grid `grid-cols-2` no row inferior direito. Imagens `next/image` `fill` + `object-cover`,
    `rounded-big`, `overflow-hidden`. Server component. **Imagens reais** em `/public/acessorios`
    (`1-capinha`→grande esq; `2-capinha-kit`→topo dir; `3-carregador` e `4-fone`→base dir; nº = ordem
    esq→dir, cima→baixo).
  - `StarcareLoyalty` é a seção **abaixo do StarShield**: programa de fidelidade "Startech Care"
    num **card central de largura média** (`max-w-[840px]`, não full-width) — fundo
    **`bg-azul-escuro/40`** (escurecido, recua), `rounded-big` + `border-white-8`. Server
    component, Tailwind. Topo: **logo grande** (`h-28 md:h-36`, esq) + título `text-h3 font-medium`
    + `.btn-link` (dir); base: 2 cards de benefício **no mesmo estilo dos painéis da Categories**
    (`bg-azul-capri/15` + `rounded-big` + `border-white-8`) + **sombra leve**
    `shadow-[0_14px_36px_rgba(0,0,0,0.2)]`; ícones `lucide` `Recycle`/`Headset` em `azul-capri`,
    mapeados por chave `recycle`/`support` no `.tsx`. ⚠️ Logo `public/startech-care.webp`
    (intrínseco 320×120 — ampliado além do nativo no desktop; trocar por maior se borrar).
- `content/site.ts` — **toda a copy** (nav, hero, features, categories, partners, support,
  starshield, starcare, acessorios, footer). Editar texto só aqui. Exporta também o **WhatsApp de contato**
  (`whatsapp.number` = `5549998353002` / +55 49 99835-3002) e o helper `whatsappLink(message)`
  que monta o link `wa.me` com a mensagem já codificada. **CTAs que abrem WhatsApp** (cada um com
  sua `cta.message`, link via `whatsappLink` + `target="_blank"`): Header (`nav.cta` "Olá, Startech!"),
  Hero (`hero.cta` "Olá, Startech!"), cards da Categories (novos/seminovos), Support
  (`support.cta` "...gostaria de assistência técnica"), StarShield ("...proteger meu celular com
  Starshield."), Starcare ("...saber mais sobre o Startech Care"), FinalCta ("Olá, Startech!") e o
  botão flutuante `WhatsAppFloat` ("Olá, Startech!").
- `lib/anim.ts` — variantes de animação.
- `lib/lenis.ts` — ponte p/ a instância do Lenis (`setLenis` registra; `scrollToTop` sobe ao topo
  com scroll suave). Usado pelo logo do Header.
- `lib/highlight.tsx` — helper `highlight(text, phrases?)`: envolve as substrings listadas em
  `phrases` num `<span className="text-white">` (branco 100%), sobrepondo a opacidade herdada do
  parágrafo. Os trechos de destaque ficam na copy (`content/site.ts`): `hero.subtitleHighlights`,
  `hero.features[].highlights`, `finalCta.subtitleHighlights`. Usado no subtítulo + bullets da Hero
  e no lead da FinalCta. **Para destacar trecho de uma frase, listar a substring aqui — não chumbar
  `<span>` no JSX.**
- `font/` — `.ttf` da Arboria.
- `public/images/` — fotos dos aparelhos (12 `.webp`, nomes `IMG_*.webp`), consumidas pelo
  `FanCards` (lista **hardcoded** no componente, em ordem crescente de nome).
- `public/iphones/` — `seminovos.webp`/`novos.webp` (transparentes) p/ `Categories`.
  `public/assistencia/` — **fotos reais** dos 5 serviços do `Support` (`tela`/`placa`/`bateria`/
  `transfere`/`pc`). `public/` (raiz) — `startech-care.webp` (logo) p/ `StarcareLoyalty`.
  `public/starshield/` — **fotos reais** do `StarShield` (`intro`/`pelicula`/`lens`/`matte`/
  `capinhas`). `public/loja/` — fotos da loja (`loja`/`close-up`/`fotos-clientes`), p/ a
  `VisitStartech`. `public/acessorios/` — **fotos reais** (`1-capinha`/`2-capinha-kit`/
  `3-carregador`/`4-fone`) p/ `Acessorios`. ⚠️ `broken.webp` e os logos de marca
  (`apple-white-logo`/`iwill-logo`/`rockspace-logo`) foram **deletados** (não mais usados).

## Design System

> **Fonte de verdade dos tokens: `app/globals.css`.** Não hardcode valores de cor, tamanho de
> fonte, raio ou espaçamento — sempre use os tokens/utilities. Se precisar de um valor que
> não existe, adicione como token no `@theme` e registre aqui.

**Cores:** `white` #ffffff · `black` #000000 · `bg` #030B0F (fundo base do site, preto
levemente azulado) · `azul-capri` #39B6FF (primária; cards-padrão em `/15`, hover do StarShield) ·
`azul-capri-dark` #008EE0 (mesma matiz, mais escuro — **fundo do `.btn`**, p/ contrastar com o texto branco) ·
`azul-escuro` #0A2540 (fundo dos cards do StarShield/Support e do painel da StarcareLoyalty, em
`/40`) · `realme-yellow` #F9DD60 · `cinza` #EEF0F2 (superfície clara — **token existe mas hoje
sem uso**, StarShield migrou pro tema escuro) · neutros translúcidos `white-32/16/8` e `black-32/16/8`.

**Tipografia** (Arboria; `letter-spacing` embutido nos tokens `text-*`: **−0.01em uniforme em
todos os estilos** — títulos e corpo; `.btn`/`.btn-link` também — ver Decisões 2026-06-05):

| Estilo | Tamanho | Line-height | Peso |
|---|---|---|---|
| `text-h1` | 64 | 60 | Bold (700) |
| `text-h2` | 48 | 50 | Book (400) |
| `text-h3` | 28 | 34 | Book |
| `text-body` | 24 | 32 | Book |
| `text-body2` | 15 | 20 | Book |
| `text-body3` | 13 | 18 | Book | *(bullets/features da Hero; largura por item via `feature.textWidth`)* |
| `text-lead` | 18 | 24 | Book | *(subtítulo Hero + descrições StarShield + lead da FinalCta; branco @73%)* |
| `text-feature` | 17 | 22 | Book | ⚠️ **ÓRFÃO** — token existe mas sem uso (Hero migrou p/ `text-body3`) |
| `text-footer` | 14 | 14 | Book |
| `text-header` | 12 | 12 | Bold (700) |

**Corner radius:** `rounded-small` 16 · `rounded-medium` 24 · `rounded-big` 32.

**Layout responsivo** (CSS vars que mudam por breakpoint — Mobile → Tablet → Desktop):

| Token | Mobile | Tablet | Desktop |
|---|---|---|---|
| `--layout-margin` | 24 | 32 | 64 |
| `--layout-padding-y` | 64 | 96 | 128 |
| `--layout-gap` | 16 | 24 | 24 |

**Grid central:** `--layout-max` = **1200px** (não muda por breakpoint) — largura máxima do
conteúdo, pra alinhar as seções na mesma grade na página inteira. Uso: container interno
`mx-auto w-full max-w-[var(--layout-max)]`. (Hoje só a `Categories` usa; aplicar nas demais.)

Uso: `px-[var(--layout-margin)] py-[var(--layout-padding-y)]` no container da seção;
`gap-[var(--layout-gap)]` no grid/flex interno.

> **Easing dos hovers:** padronizado em **`ease-in-out`** em todo o site (CSS: keyword `ease-in-out`;
> Tailwind: utility `ease-in-out`) — `.btn`/`.btn-icon`/`.ss-card`/FanCards `.card` + os hovers
> Tailwind (Categories, WhatsAppFloat, Header, Footer, Support). StarShield em **1.1s**.

**Botões:** formato pill (`border-radius: 9999px`). `.btn` (primário, fundo **`azul-capri-dark`**
#008EE0 — escurecido p/ contrastar com o texto branco bold; **hover** = `scale(1.05)` central +
fundo clareia p/ `azul-capri` + **sombra leve azul-clara centralizada** (`box-shadow: 0 0 18px
rgb(57 182 255 / 0.5)` — igual em todos os lados) + o **glyph do ícone também passa p/ `azul-capri`**
(`.btn:hover .btn-icon`), `transition 0.35s` suave, texto/ícone **sempre branco 100%**, sem mudar
opacidade), `.btn-sm` (variante menor),
`.btn-link` ("Comprar ↗", link **`azul-capri`** #39B6FF — mantém o azul claro). **`.btn-icon`**:
ícone (WhatsApp) num **círculo branco** `position:absolute` colado à esquerda do pill, com **inset
igual** em cima/baixo/esquerda (`top`/`bottom`/`left` + `aspect-ratio:1` mantém o círculo),
SVG tingido de `azul-capri-dark`. Na
prática quem monta o pill+ícone é o componente **`WhatsAppButton`** (não usar `<a class="btn">`
solto p/ CTA de WhatsApp — usar o componente).
⚠️ Padding e font-size dos botões foram **inferidos** (não estavam no design system) — ajustar quando tivermos o layout real.

## Convenções de trabalho

- Trabalhar **uma seção por vez**; para cada uma, usar o frame do Figma + a copy revisada + os tokens.
- **Separar copy de layout** — manter os textos em arquivo/estrutura própria, não chumbados no JSX.
- Mobile-first; respeitar os breakpoints Tablet `≥768px` e Desktop `≥1024px`.
- Nada de valores mágicos: tudo sai dos tokens.

---

## Decisões (log)

- **Não exportar do Framer; reconstruir do zero** usando o Figma como fonte de verdade.
- **Tailwind v4 CSS-first** (`@theme`) em vez de `tailwind.config.js` — unifica CSS vars + utilities.
- **Vertical padding = 128 / 96 / 64** (estava em branco no design system original; definido agora).
- **Gaps = 24 / 24 / 16**, escolha consciente:
  - desktop e tablet iguais (24) — proposital, não é esquecimento;
  - mobile 16 (poderia ser 12; ficou 16 para manter o grid de 8px).
- **(2026-06-02) Hero + Header construídos** a partir do screenshot da referência.
  - Headline `text-h2 md:text-h1` com `max-w-[32ch]` + `text-balance` pra forçar as 2 linhas
    do original ("Smartphones seminovos e / lacrados com 1 ano de garantia").
  - Subtítulo em `text-body2` (15), não `text-body` — é o menor da escala, bate com a referência.
  - Glow do fundo = `.hero-bg` (dois radial-gradients de azul-capri subindo da base sobre preto).
  - Cards de feature num painel `rounded-medium` + `border-white-8`, divididos por `gap-px`.
    Ícones em `lucide-react` tintados de `azul-capri` (o original tinha ícones coloridos variados —
    escolha de unificar na marca; revisitar se quiserem os ícones originais).
  - Logo "STAR TECH" é placeholder textual (Arboria bold itálico) — trocar pelo lettering/SVG real.
- **`next/font/local` em vez de `@font-face` manual** (decisão da pendência) — evita FOUT, mais limpo.
- **(2026-06-02) Hero refeito: tela cheia + features sem caixa.**
  - Section virou **`h-screen`** (ocupa exatamente o viewport, sem sobra/scroll); conteúdo
    central em `flex-1` centralizado e as features fixadas na base (`pb-12`).
  - Features: removida a caixa/painel; **ícone grande à esquerda** (`size-9`, azul-capri) +
    texto maior, sem `<br>`. Grade `1 / 2 / 4` colunas.
  - **Token novo `text-feature` (17px).** Exigência do cliente: os 4 textos **sempre em 2 linhas**,
    a quebra controlada só pela largura. O desafio: numa coluna de 4 (~310px) o ícone+gap deixam
    só ~258px pro texto, e os textos variam de 33 a 58 chars. Medi as larguras reais da Arboria
    (GDI/MeasureString) e achei a janela: com **17px + caixa de texto ~252px** (`max-w-[252px]`)
    os 4 caem em 2 linhas (janela válida ~244–264px). ⚠️ É calibrado pro desktop (~1440); em
    larguras de coluna bem menores pode quebrar diferente — revisitar responsivo se necessário.
- **(2026-06-04) `FanCards` — leque 3D parado com hover expand, abaixo da Hero.** Fotos dos aparelhos
  como um baralho inclinado **fixo**; no hover o card endireita e amplia (no mobile, `:hover` dispara
  no toque → tap pra expandir).
  - **CSS puro (sem libs), em CSS Module** (`FanCards.module.css`), não Tailwind: efeito 3D com muitos
    estados encadeados (perspectiva, `transform-origin`, seletores de irmãos) ilegível em utilities.
    **Server component** — zero JS, tudo `:hover`.
  - Mecânica: **perspectiva no pai `.fan`** (`perspective: 2000px`); cards com `transform-origin: left
    center` + `rotateY` (repouso) que abrem como leque; **sobreposição via `margin-right` negativo`**;
    os cards à direita do hovered deslocam com `.card:hover ~ .card { translateX }` pra abrir espaço.
    Transição `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Respeita `prefers-reduced-motion`.
  - **Valores calibrados com o cliente (desktop):** card `290px`, `margin-right: -95px` (leque aberto),
    repouso `rotateY(28deg)`, hover `scale(1.18)` + `translateZ(70px)`. Breakpoints reduzem largura
    (tablet 230 / mobile 180); leque centralizado (`justify-content: center`), `overflow-x: clip`.
  - **Peek na Hero:** `margin-top` negativo (−154 desktop / −142 tablet / **0 mobile**) pra a ponta dos
    cards "espiar" no rodapé da Hero e convidar o scroll.
  - Imagens **hardcoded** no `.tsx` (12 `.webp` de `public/images`). ⚠️ Se mudar a pasta, atualizar array.
  - **Histórico de tentativas (descartadas):** virou **marquee auto-infinito** e depois **drag-to-scroll**
    (client component, pointer events, lista duplicada), mas o cliente preferiu **voltar ao leque parado
    só com hover** — o drag deixava o expand "clicável" (o `setPointerCapture` atrapalhava o `:hover`).
  - **Valores calibrados com o cliente (desktop):** card `290px`, `margin-right: -95px` (leque aberto),
    repouso `rotateY(28deg)` (bem virado pra frente), hover `scale(1.18)` + `translateZ(70px)`.
    Breakpoints reduzem largura/deslocamento (tablet 230 / mobile 180); hover mantém `scale(1.18)`.
  - **Peek na Hero:** a seção é puxada pra cima com `margin-top` negativo (−154 desktop / −142 tablet /
    **0 no mobile** — sem peek) pra a ponta dos cards "espiar" no rodapé da Hero e convidar o scroll.
    `overflow-x: clip` (não `hidden`) mantém o eixo Y visível (hover/peek não cortam).
  - Imagens **hardcoded** no `.tsx` (12 `.webp` de `public/images`), `<img>` puro com `object-fit: cover`
    + leve dessaturação que volta no hover. ⚠️ Se adicionar/renomear arquivos na pasta, atualizar o array.
- **(2026-06-05) `FanCards` v2 — voltou a ser ESTEIRA automática (marquee) p/ a direita.** O cliente
  pediu o leque **sempre em movimento**, lento e contínuo, mantendo o hover expand. Em vez do
  drag-to-scroll antigo (client component, problemático), agora é **CSS puro** (segue server component):
  lista **duplicada** + `animation: fanScroll 60s linear infinite` translando `-50% → 0` (loop seamless).
  Pra não achatar o 3D **e manter o hover funcionando**, a perspectiva é **embutida em cada card**
  (`transform: perspective(2000px) rotateY(...)`), não no pai — `perspective`+`preserve-3d` no pai
  fazia o 3D renderizar mas **quebrava o hit-testing do `:hover`** (tentado e revertido). Camadas:
  `.fan` (recorta) > `.track` (esteira animada). Removido `.card:last-child{margin-right:0}`
  (uniformidade do loop). **Não pausa no hover** (pedido). Reduced-motion: `.track { animation: none }`.
  ⚠️ `.fan` deve ser `justify-content: flex-start` (não `center`) — centralizar abria um **vácuo na
  direita** no fim do deslocamento (a borda da esteira saía do viewport). ⚠️ Em telas mais largas que
  **1 cópia** (~2340px) pode reaparecer vácuo — se acontecer, **triplicar** a lista e animar `-33.33%→0`.
- **(2026-06-04) `Categories` — 2 painéis (Seminovos | iPhones novos) abaixo do FanCards.**
  - Primeira seção a usar o **grid central de 1200px** (`--layout-max`): a `<section>` cuida do
    padding (margin lateral + `padding-y`), e um container interno `mx-auto max-w-[var(--layout-max)]`
    segura o grid `1 → 2 colunas` com **gap fixo de 24px** (`gap-6`). Token criado pra valer na
    página inteira — aplicar nas outras seções depois.
  - Painéis: `bg-azul-capri/15` + `rounded-big` + `border-white-8`. **Texto centralizado** no topo
    (título `text-h3 md:text-h2`, descrição `text-body2`, `.btn-link` "Comprar ↗"); imagem na base
    centralizada, **`object-contain` `h-[400px]`** (sem crop, sem radius), com `pb` espelhando o `pt`.
    Imagens `seminovos.webp`/`novos.webp` em **`public/iphones/`** (transparentes).
  - Server component, Tailwind (layout simples, sem JS). Copy em `content/site.ts` (`categories`).
- **(2026-06-04) `Partners` — faixa de marcas + `Support` — carrossel de assistência.**
  - `Partners`: título `text-body2` bold centralizado + **logos placeholder** (logo Startech
    repetida 4x, `count` no `content/site.ts`). Dentro do grid 1200px. ⚠️ Espaçamento: a Partners
    tem `pt-[128px]` próprio **e** a Categories já tem `padding-bottom` (128 desktop) → no desktop
    o respiro somado é ~256px (decisão de não mexer na Categories; revisitar se incomodar).
  - `Support`: **client component** (índice de item + `matchMedia`), único carrossel com JS.
    1/2/3 cards por view (mobile/tablet/desktop); navegação **de 1 em 1 item** —
    `translateX(-index*(100/perView)%)` com transição `cubic-bezier(...)`; **setas** fora da
    área dos cards (layout `[seta][viewport][seta]`). CTA `.btn` no fim. Hoje são **5 serviços**.
    ⚠️ **Atualizado (2026-06-05):** virou **loop infinito** (não clampa mais) e os cards ganharam
    **fundo** — ver decisão "Support v2" abaixo.
- **(2026-06-04) Títulos de seção em Bold.** Arboria **não tem Semibold (600)** — pesos: Thin/Light/
  Book(400)/Medium(500)/Bold(700)/Black. Pedido era semibold; como não existe, o cliente optou por
  **Bold**. Aplicado em Categories/Support/Partners (`font-bold`). ⚠️ **Não há classe/componente
  compartilhado de "título de seção"** — cada seção repete os tokens no JSX (dá pra criar
  `<SectionTitle>` se virar dor). Título de card do Support ficou **Book (400)** (regular).
- **(2026-06-04) Ajustes Hero mobile.** Título estava fino (mobile usa `text-h2` = peso 400) e
  **cortando no topo** (`h-screen` + `overflow-hidden` clipava conteúdo alto). Correções: `font-bold`
  + `leading-[0.95]` no título; **`min-h-screen md:h-screen`** (cresce em vez de cortar, sem
  `overflow-hidden`); features com **ícone em cima + texto centralizado** no mobile
  (`flex-col`→`md:flex-row`); **separadores horizontais** entre itens no mobile (verticais no desktop).
- **(2026-06-04) Glow virou fundo GLOBAL fixo (`.site-bg`), não mais por-seção.**
  - Antes o glow morava no `.hero-bg` (na `<section>` da Hero). Como cada seção pintava o próprio
    fundo, a borda entre Hero e FanCards **cortava o gradiente** = linha dura/preta na junção.
    Tentativa de "continuar" o glow no topo do FanCards não resolveu bem.
  - Solução: **um único fundo `position: fixed; inset: 0; z-index: -10`** (`.site-bg`, montado no
    `layout.tsx` como 1º filho do `<body>`, `pointer-events: none`). Hero e FanCards ficam com
    **fill transparente** e deixam esse fundo aparecer — nenhuma seção corta mais o gradiente.
  - ⚠️ Por ser `fixed`, o glow fica **ancorado na base da viewport** (acompanha o scroll), não na
    base da Hero. Se um dia quiser que ele role embora, trocar pra `absolute` + wrapper `relative`.
  - Glow **aumentado** (elipses ~160%/110%, stops empurrados pra 78%/70%) pra ocupar mais área.
  - **Token novo `--color-bg` (#030B0F)** — preto levemente azulado; substituiu `black` puro como
    base do `.site-bg` e do `body`.

- **(2026-06-05) `StarShield` (tema claro) + `StarcareLoyalty` (fidelidade), abaixo do Support.**
  - **`StarShield`** introduzia o **primeiro tema CLARO** do site (cards de fundo branco/`cinza`
    com texto escuro `bg`) sobre o fundo global escuro. Pilha de cards no grid 1200px: hero
    full-width 2-col → duo (2 cards) → wide (Matte / Capinhas) → CTA. **Tokens de cor novos:**
    `--color-azul-escuro` #0A2540 e `--color-cinza` #EEF0F2 (superfícies claras). Imagens via
    `next/image` `fill`+`object-cover`. Server component, Tailwind. ⚠️ **Revertido (2026-06-05):**
    o tema claro foi abandonado — ver decisão "StarShield v2 (tema escuro + hover)" abaixo.
  - **`StarcareLoyalty`**: card central `max-w-[840px]` (não full-width). **Fundo do card de
    trás escurecido** (`bg-azul-escuro/40`) pra recuar e dar profundidade; os 2 cards de benefício
    embaixo seguem o **estilo dos painéis da Categories** (`bg-azul-capri/15` + `rounded-big` +
    `border-white-8`, mais claros = saltam à frente) com **sombra leve e espalhada**
    (`shadow-[0_14px_36px_rgba(0,0,0,0.2)]`). **Logo aumentado** pra `h-28 md:h-36` (112/144px).
    Ícones `lucide` (`Recycle`/`Headset`) mapeados por chave (`recycle`/`support`) — manter o mapa
    em sincronia com a copy se adicionar benefícios.
  - **Títulos destas seções em Medium (500), não Bold** — diferente das seções anteriores
    (Categories/Support/Partners usam `font-bold`). ⚠️ Inconsistência consciente/provisória;
    uniformizar quando definir o padrão de título de seção.
  - ⚠️ **Conteúdo provisório:** copy ainda placeholder. Imagens do StarShield **já trocadas
    pelas reais** (`/public/starshield`); Starcare segue com `startech-care.webp`.
- **(2026-06-05) Letter-spacing dos títulos afrouxado.** Tokens `text-h1/h2/h3` foram de
  `-0.03em` → **`-0.01em`** (pedido do cliente: "aumentar levemente o espaço entre letras em
  todos os títulos"). Aplica-se a todas as seções automaticamente; corpo (`text-body`,
  `text-body2`, `text-feature`, etc.) **mantinha −0.03em**. ⚠️ **Substituído (2026-06-05) — ver abaixo.**
- **(2026-06-05) Letter-spacing UNIFORME em −0.01em + descrições padronizadas em Book.**
  - Pedido do cliente: **todo o letter-spacing em −0.01em**. Os tokens que ainda estavam em
    `-0.03em` (`text-body`, `text-body2`, `text-feature`, `text-footer`, `text-header`) e os
    botões (`.btn`, `.btn-link`) foram para **`-0.01em`**. Agora **toda** a escala usa −0.01em.
  - **Descrições padronizadas em Book (400):** os bullets/features da Hero usavam `font-light`
    (300) — removido. Agora todas as descrições do site (`text-body2` em Hero/Categories/Support/
    StarShield/StarcareLoyalty) usam o **peso padrão Book (400)** do token, sem override de peso.
- **(2026-06-05) `StarShield` v2 — tema escuro + hover.** O tema claro (cards brancos/`cinza`,
  texto escuro) foi **abandonado**: agora **cada card herda o estilo do painel da `StarcareLoyalty`**
  — `bg-azul-escuro/40` + `border-white-8` + `rounded-big`, texto **branco** (`text-white` /
  `text-white/60`). **Sem wrapper externo** (a pilha continua solta no grid 1200px, `flex-col gap-6`).
  **Hover** nos 3 tipos de card (hero / duo / wide): fundo `bg-azul-escuro/40` → **`bg-azul-capri/15`**
  (o azul dos cards menores da Starcare) + **`scale-[1.02]`**, `transition duration-500`,
  `relative hover:z-10` pra o card crescido ficar por cima dos vizinhos. ⚠️ No hero/wide a imagem
  `object-cover` escala junto com o texto (card inteiro). Token `cinza` ficou **órfão** (sem uso).
- **(2026-06-05) `Support` v2 — loop infinito + cards com fundo.**
  - **Loop infinito de verdade:** a lista de serviços é **triplicada** (`[...s, ...s, ...s]`),
    o índice começa no **bloco do meio** (`useState(n)`) e a navegação só incrementa/decrementa.
    No `onTransitionEnd`, se o índice saiu do bloco do meio (`>= 2n` ou `< n`), faz um **teleporte
    sem animação** (`transition: none` num render, reabilitada no `requestAnimationFrame` seguinte)
    pro item equivalente do centro. Efeito: rola contínuo nos dois sentidos e **as setas nunca
    desabilitam** (removido o `disabled`/clamp). Keys precisam de índice (`${title}-${i}`) porque há
    clones. ⚠️ Em telas muito lentas o teleporte pode piscar; se acontecer, aumentar os clones.
  - **Cards com fundo:** cada `<article>` agora usa **`bg-azul-escuro/40` + `border-white-8` +
    `rounded-big`** (mesmo card do StarShield), `p-6` (24px todos os lados), **texto full-width**
    centralizado (tirado o `max-w-[28ch]` e o `items-center`). O `<li>` mantém o gutter
    (`px-[calc(var(--layout-gap)/2)]`); `items-stretch` no `<ul>` deixa todos os cards da mesma altura.
  - **Espaçamentos:** título do card sem `min-h-[64px]` (descrição colada, `mt-2`) — ⚠️ títulos de
    1 vs 2 linhas podem desalinhar a descrição entre cards (imagem ancora na base via `flex-1`, então
    o card no geral fica alinhado). Padding cabeçalho↔carrossel subiu pra `mt-16` (= o do CTA, 64px).
- **(2026-06-05) Hero — copy + tipografia atualizadas (estado atual).** O Hero divergiu do que o
  log de 2026-06-02 descrevia; estado real hoje:
  - **Copy nova:** título "iPhones seminovos e lacrados, com até 2 anos de garantia" (era "...1 ano");
    subtítulo + 4 features reescritos (ver `hero` em `content/site.ts`).
  - **Subtítulo** agora em **`text-lead`** (18, branco @73%, `max-w-[64ch]`) com **highlight**
    (`hero.subtitleHighlights`) — não mais `text-body2`.
  - **CTA WhatsApp no Hero** (`WhatsAppButton`, `hero.cta`) entre subtítulo e features.
  - **Features** em **`text-body3`** (13), ícone `size-6` `strokeWidth 1.75` em `azul-capri`,
    **largura por item** via `feature.textWidth` (px, na copy) em vez do `max-w-[252px]` fixo.
    Separadores horizontais (mobile) / verticais (desktop) entre os itens. → o token **`text-feature`
    (17px) ficou ÓRFÃO** (sem uso; calibração antiga descartada).
- **(2026-06-05) SEO/metadata atualizados.** O `metadata` do `layout.tsx` estava com a copy antiga
  ("Smartphones... 1 ano"). Novo **title** "StarTech | iPhones Seminovos e Novos em Chapecó – SC" e
  **description** (até 2 anos de garantia, canal oficial Apple, assistência em Chapecó, 18x sem juros),
  + **Open Graph** + **Twitter card** + keywords. **Favicon** `public/icon.webp` e **imagem OG**
  `public/social.png` (1200×630) ligados. `metadataBase` via `NEXT_PUBLIC_SITE_URL` (fallback
  **`startechcelulares.com.br`**, domínio de produção). Deploy de teste atual na **Vercel**
  (`startech-rho.vercel.app`).
- **(2026-06-06) `FanCards` — peek reduzido por ALTURA de viewport (fim da sobreposição com os
  bullets da Hero).** O problema NÃO era largura e sim **altura**: numa janela baixa (ex.: **1490×670**,
  laptops **1366×768**) a Hero (`h-screen`) encolhe, os bullets descem e o **peek fixo** (`-154px`)
  encostava/sobrepunha. **1ª tentativa (descartada):** deixar tudo fluido por largura (clamp/vw) —
  mirou no eixo errado e ainda mexeu nos tamanhos calibrados (cliente pediu p/ reverter). **Correção
  final:** mantidos os valores calibrados (290/230/180, peek −154/−142/0 por largura) **+ media
  queries por ALTURA** `@media (min-width:768px) and (max-height:820px){ -64px }` e `max-height:720px
  { -8px }`. Lição: peek num elemento que invade uma seção `h-screen` precisa reagir à **altura** do
  viewport, não à largura.
- **(2026-06-05) `CursorGlow` — cursor de luz laranja com rastro.** Pedido do cliente. Implementado
  com **canvas** (não DOM/divs) p/ o efeito de "luz": pontos que decaem desenhados com
  `globalCompositeOperation="lighter"` (soma de luz = bloom). Canvas fixo `z-[100]` `pointer-events-none`,
  montado no `layout.tsx`. **Decisões:** (1) **esconde o cursor nativo** (classe `cursor-glow-active`
  no `<html>` + `cursor:none` no `globals.css`) — só quando o efeito está ativo, então touch/reduced-motion
  mantêm o nativo; (2) só em **`pointer: fine`** + respeita reduced-motion; (3) `devicePixelRatio`
  capado em 2 p/ perf. Cor **laranja** (#FF7A1A) é **proposital** (off-brand vs azul da marca, ok).
  - ⚠️ **Ajuste (mesmo dia):** estava um "bolão amarelo" grande/luminoso. Causas: empurrava ponto
    **todo frame** (acúmulo com mouse parado), núcleo **branco** e alphas/raios altos (aditivo satura
    pro amarelo). Correção: **gate por distância** (`MIN_DIST`, só rastro em movimento), núcleo
    **laranja**, alpha `0.5→0.22`, `DECAY 0.045→0.06`, `LERP 0.2→0.16`. Resolveu o amarelo/luminância.
  - **Tamanho (iterado a pedido):** depois de resolver a luminância, o cliente pediu **maior**.
    Valores atuais: raio do rastro **`24*life + 5`** e núcleo (`coreR`) **`10`** (passou por
    `11`/`2` → `15`/`3` → `24`/`5`; núcleo `5`→`7`→`10`). Alpha mantido em `0.22` p/ crescer sem
    voltar a amarelar. Ajustar esses dois números p/ recalibrar tamanho.
- **(2026-06-05) Seção `InstagramFeed` (antes da VisitStartech).** v1 nasceu com **8 posts
  hardcoded** (`picsum.photos`) num grid 4×2 — placeholder p/ API. **v2 (mesmo dia):** trocada pela
  integração real com o **Feedframer** (proxy da API do Instagram), **6 posts**, grade 3×2.
  Componente virou **server component async** que faz `fetch` em `getPosts()` com a key
  **`FEEDFRAMER_API_KEY`** (env, **server-side** — nunca exposta no client) + **ISR `revalidate 3600`**.
  Endpoint `feedframer.com/api/v1/me?api_key=…&page[size]=6`; mapeia `id`/`permalink`/`mediaUrl`/
  `thumbnailUrl`. **Fallback** "Ver no Instagram" se sem key/API fora. Validado: build prerenderiza
  `/` como estático com revalidate 1h; API testada (HTTP 200, 6 posts de `startechcelulares`).
  ⚠️ **Netlify:** setar `FEEDFRAMER_API_KEY` nas env vars do site. (Async server component passa
  como children do `<Reveal>` client normalmente.) Por que não Behold: o cliente escolheu Feedframer.
- **(2026-06-05) Header mobile + logo como "voltar ao topo" + logo maior.** Pedido do cliente:
  (1) **logo um pouco maior** — `Logo` default `h-9/md:h-10` → **`h-10/md:h-12`**; (2) **mobile só
  com o logo** — redes sociais e CTA viram `hidden md:flex`; (3) **logo = botão p/ subir ao
  topo** — `<button onClick={scrollToTop}>` (de `lib/lenis.ts`), que usa o **Lenis** (scroll suave,
  `duration 1.6`) p/ manter a "gravidade da lua"; fallback `window.scrollTo` quando o Lenis não está
  ativo. P/ isso a instância do Lenis passou a ser exposta (`setLenis` no `SmoothScroll`).
  ⚠️ **Correção (mesmo dia):** o logo **não clicava** — o layout usava `absolute left-1/2
  -translate-x-1/2` p/ centrar, mas o `transform` inline do **framer-motion** (entrada `floatUp`)
  sobrescrevia o `-translate-x-1/2` e, com o `pointer-events-none` do wrapper sobreposto, matava o
  clique. Trocado por **grid de 3 colunas** (`grid-cols-1 md:grid-cols-3`) com centralização via
  **`justify-self-center`** — não depende de transform nem de `pointer-events`. Lição: **não
  centralizar com `-translate-x` um elemento que o framer-motion anima** (ele controla o `transform`).
- **(2026-06-05) Scroll-reveal das seções (entrada estilo Hero).** Pedido do cliente: todas as
  seções devem "entrar na tela como o conteúdo principal da Hero", ao chegar nelas no scroll.
  Criado `components/Reveal.tsx` (client): `motion.div` com a variante **`floatUp`** (a mesma da
  Hero) disparada por **`whileInView`** (`viewport={{ once:true, amount:0.2 }}`). No `page.tsx`
  cada seção é envolvida por `<Reveal>` — anima como **unidade** (não há stagger por elemento como
  na Hero; decisão de simplicidade/baixo risco, mantendo o mesmo *vocabulário* de movimento). ⚠️
  **Hero** (anima no load) e **FanCards** (esteira contínua + peek negativo na Hero) ficaram de fora
  pra não brigar com o layout. `reducedMotion="user"` (MotionConfig) já entrega o conteúdo assentado
  p/ quem reduz movimento. ⚠️ Se quiserem a cascata interna (título→cards) igual à Hero, dá pra
  empurrar `Reveal`/`floatUp` pros blocos de cada seção (mais invasivo).
  - **Velocidade:** a pedido, o `floatSpring` (em `lib/anim.ts`) ficou um pouco mais rápido
    (`42/16/1.1` → `58/17/0.9`). Como é o spring compartilhado, **acelera também a entrada da Hero**
    (consistente). P/ ajustar de novo: ↑stiffness / ↓mass = mais rápido.
  - **StarShield em cascata (a pedido):** virou **client component** e passou a fazer o próprio
    reveal com **stagger interno** (em vez de entrar como bloco único via `<Reveal>`). Container
    interno = `stagger` (`whileInView`); cada bloco (hero / duo / wide / CTA) = item `floatUp`; a
    linha **duo é stagger aninhado** (os 2 cards em sequência). Removido o `<Reveal>` que a
    envolvia no `page.tsx`. ⚠️ Mesmo "problema do bloco alto" das outras seções: como dispara num
    único ponto (15% visível), os cards de baixo podem animar antes de aparecer — aceitável p/ o
    efeito de cascata. Se quiserem que CADA card revele só ao chegar nele, daria pra dar
    `whileInView` próprio a cada bloco (sem stagger sincronizado).
- **(2026-06-05) Lenis smooth scroll — perfil "gravidade da lua".** Pedido do cliente: o scroll
  deve simular baixa gravidade — ao soltar a roda, coastear e "pousar" suave. Instalado `lenis`
  (1.3.x); provider `components/SmoothScroll.tsx` (client, `null`) inicia o Lenis num loop `rAF`.
  **Modo `lerp` baixo (`0.06`)** porque o lerp decai EXPONENCIALMENTE (rápido→assintótico) = pouso
  suave natural, e baixo = muito "tempo no ar". `wheelMultiplier 1.15` (empurrão por giro). Toque
  fica nativo (`syncTouch: false`) — gravidade lunar é p/ a roda/trackpad. Não ativa em "reduzir
  movimento" (fallback p/ `scroll-behavior: smooth` nativo). CSS `.lenis*` no `globals.css`
  (desliga o smooth nativo enquanto o Lenis controla). ⚠️ P/ ajustar o "peso" da lua, mexer no
  `lerp` (menor = mais flutuante/lento). De quebra: corrigido um erro de tipo pré-existente no
  `Support.tsx` (`n: number` — `services.length` virava literal `5` do `as const` e quebrava o
  `setIndex`), que travava o `next build`.
- **(2026-06-05) Hover reduzido (StarShield + FanCards).** Pedido do cliente: cards crescendo
  menos no hover. **StarShield**: `scale-[1.03]` → **`scale-[1.02]`** nos 3 tipos de card (Categories
  segue em `1.03`, não foi pedido). **FanCards**: ponto final do hover de `scale(1.30)` + `translateZ(90px)`
  → **`scale(1.18)` + `translateZ(70px)`** (mobile `translateZ` 60→50, scale unificado em 1.18); o
  deslocamento dos cards vizinhos (`translateX`) caiu junto (160→120 / 130→100 / 100→80) já que o card
  ampliado ocupa menos espaço. São efeitos de magnitude diferente (empurrão sutil vs salto do leque),
  então os números não são iguais — só mais contidos.
- **(2026-06-05) `Support` — imagens reais ligadas.** Os 5 serviços apontavam pra `/broken.webp`
  (placeholder **deletado** → imagem 404). Trocado pelas **fotos reais** em `/public/assistencia`
  (`tela`/`placa`/`bateria`/`transfere`/`pc`), casadas 1:1 com os serviços na copy.
- **(2026-06-11) `Categories` — foto real + `StarShield` reorganizado.**
  - **Categories (seminovos):** trocada a imagem por **foto real** (`/images/IMG_7507.webp`, 810×1080
    retrato — antes era recorte transparente). **Restilizada no padrão das fotos do StarShield:**
    o padding saiu do card inteiro e foi pro lado do texto (`p-8 md:p-12`); a imagem ganhou wrapper
    só com `p-4` + `rounded-medium` + **`object-cover`** (`h-[340px] md:h-[440px]`), ficando a 16px
    da borda igual às imagens do StarShield.
  - **StarShield:** removido o botão **"Saiba mais"** do card hero (e o import `ArrowUpRight`); o
    `hero.cta` continua na copy mas **não é mais renderizado**. **Card "Basic" removido**; **"Lens"
    virou card horizontal** (movido pro array `wide`) — bloco `duo`/stagger aninhado **deletado** do
    componente. **"Matte" renomeado p/ "Película"** (`/starshield/peliculas-tela.webp`). Imagens novas:
    `capa.webp` (Capinhas) e `peliculas-tela.webp`; arquivos órfãos `matte.webp`/`capinhas.webp`/
    `pelicula.webp` apagados. Cards finais: **hero → Lens → Película → Capinhas**.
- **(2026-06-11) Favicon/OG — formatos por compatibilidade.** Cliente subiu `icon`/`social` como PNG.
  Decisão de formato (não é "tudo webp"): **favicon `public/icon.webp`** (convertido do PNG via
  `sharp`, 627×627, ~15KB — webp é ideal p/ favicon) + **apple-touch-icon `public/icon.png`**
  (`metadata.icons.apple` — **PNG porque o iOS não renderiza webp** p/ ícone de home screen) +
  **imagem OG `public/social.png`** (1200×630, **mantida PNG de propósito** — webp em Open Graph não
  é renderizado por vários crawlers, ex.: WhatsApp/Facebook). Lição: **OG/apple-icon ≠ webp**.

## Hurdles & Correções (log)

> Registrar aqui todo obstáculo encontrado e como foi resolvido — vira histórico pra não
> repetir erro. Formato sugerido: data · problema · causa · correção.

- **(2026-06-02) Screenshot headless não captura Framer Motion.** · Problema: ao printar
  via Edge `--headless` + `--virtual-time-budget`, todo elemento animado saía em `opacity: 0`
  (página "vazia"). · Causa: o Framer Motion acelera opacity/transform via **WAAPI**, cuja
  timeline não avança com o virtual-time-budget do Chromium. Roda normal em navegador real. ·
  Correção/validação: pra conferir layout, desligar a animação temporariamente (em `lib/anim.ts`,
  `floatUp.hidden` = estado final) e religar depois. Não é bug do site.
- **(2026-06-02) Build quebrou com `Cannot find module './611.js'`.** · Problema: `next build`/
  `next start` falhava buscando um chunk inexistente. · Causa: cache `.next` corrompido —
  rodar `dev` e `build`/`start` se atropelando e matar processos no meio da escrita deixa
  chunks órfãos. · Correção: parar todos os servers, **apagar `.next`** (`Remove-Item -Recurse
  -Force .next`) e buildar de novo. Evitar rodar `dev` e `build` ao mesmo tempo.

## Pendências

- [x] **~~Confirmar versão do Tailwind.~~** Confirmado **v4** (`@theme`), instalado `tailwindcss@^4`.
- [x] **~~Arboria: hospedar + escolher carregamento.~~** Feito via `next/font/local` lendo `/font/*.ttf`.
      ⚠️ MAS a licença atual é **demo/personal (ifonts.xyz)** — ver pendência de licença abaixo.
- [ ] **Licença da Arboria:** comprar a licença comercial real (Dada Studio) antes de produção —
      os `.ttf` atuais são "Demo for Personal Use", impróprios para site comercial.
- [ ] **Ajustar dimensões reais dos botões** (padding/font-size hoje são inferidos).
- [x] **~~Logo real.~~** Usando `public/startech-logo.png` (oficial) via `next/image`.
      (Opcional futuro: versão SVG pra nitidez perfeita em qualquer tamanho.)
- [x] **~~Menu de navegação.~~** Hambúrguer + links de nav **removidos em definitivo** do Header
      (2026-06-05); `nav.links` apagado do `content/site.ts`. Header = social + logo + botão. Não volta.
- [ ] **Validar contra o Figma:** o Hero foi feito a partir do screenshot; conferir medidas/cores
      exatas quando o frame do Figma estiver à mão.
- [x] **~~Favicon + imagem OG.~~** (2026-06-11) Ligados com formatos por compatibilidade:
      `icon.webp` (favicon, convertido do PNG via `sharp`), `icon.png` (apple-touch-icon, PNG p/ iOS)
      e `social.png` (OG 1200×630, mantido PNG — webp não funciona em OG). Ver decisão de 2026-06-11.
- [x] **~~Conectar Git remoto.~~** Repo no GitHub: `felipeaitafla/startech` (`origin`, branch `main`).
- [ ] **Conectar Netlify** (link de deploy automático) — **será feito na entrega do projeto.**
      ⚠️ Ao linkar, setar as **env vars**: `FEEDFRAMER_API_KEY` (feed do Instagram) e
      `NEXT_PUBLIC_SITE_URL` (domínio final, p/ a imagem OG). Ver `.env.example`.
- [ ] **StarShield/Starcare — copy definitiva:** imagens do StarShield **já são reais**
      (`/public/starshield`; cards atuais Lens/Película/Capinhas); falta a **copy definitiva** dos
      cards (descrições ainda provisórias). Starcare ainda usa `startech-care.webp` (logo) — ok.
- [x] **~~Acessórios — imagens definitivas.~~** Fotos reais em `/public/acessorios`
      (1-capinha/2-capinha-kit/3-carregador/4-fone).
- [x] **~~Support — imagens dos serviços.~~** Fotos reais em `/public/assistencia`
      (tela/placa/bateria/transfere/pc); `broken.webp` (placeholder) deletado.
- [x] **~~VisitStartech — foto real da loja.~~** Usando `/public/loja`
      (loja/close-up/fotos-clientes).
- [ ] **Padronizar título de seção:** StarShield/Starcare usam Medium (500); as demais, Bold (700).
      Definir o padrão e uniformizar (possível `<SectionTitle>`).
- [ ] **Hover do StarShield — imagem escala junto:** no hero/wide o card inteiro (texto + imagem
      `object-cover`) faz `scale-[1.02]`. Decidir se fica assim ou se só o painel de texto muda de
      cor/escala (imagem estática).
- [ ] **Support — desalinhamento de descrição:** sem o `min-h` no título do card, serviços com
      título de 1 vs 2 linhas começam a descrição em alturas diferentes. Revisitar (talvez um
      `min-h` menor) se incomodar com a copy definitiva.
- [ ] **Support — teleporte do loop:** validar em telas lentas se o "snap" silencioso do carrossel
      infinito não pisca; se piscar, aumentar o nº de clones.
