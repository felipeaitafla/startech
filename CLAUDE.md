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
  (stiffness 42 / damping 16 / mass 1.1) + blur→nítido + bob (`drift`) contínuo.
  `MotionConfig reducedMotion="user"` em `components/MotionProvider.tsx` respeita
  "reduzir movimento" do SO.
- **Ícones: `lucide-react`** (+ glyph WhatsApp inline no Header, que o lucide não tem).
- **Deploy: Netlify** — `netlify.toml` configurado (plugin `@netlify/plugin-nextjs`).
  Git no GitHub: `felipeaitafla/startech` (`origin`, branch `main`). **Falta linkar na Netlify**
  — será feito na entrega do projeto.

## Estrutura de arquivos

- `app/layout.tsx` — html lang pt-BR, Arboria via next/font/local, MotionProvider, metadata.
  Monta também `<div className="site-bg">` (fundo global fixo) como 1º filho do `<body>` e o
  `<WhatsAppFloat/>` (botão flutuante de WhatsApp, fixo no canto inf. direito) como último filho.
- `app/page.tsx` — monta `<Header/>` + `<Hero/>` + `<FanCards/>` + `<Categories/>` + `<Partners/>` + `<Support/>` + `<StarShield/>` + `<StarcareLoyalty/>`.
- `app/globals.css` — **fonte de verdade dos tokens** + base + `.btn*` + `.site-bg` (fundo global).
- `components/` — `Header.tsx`, `Hero.tsx`, `FanCards.tsx` (+ `FanCards.module.css`), `Categories.tsx`, `Partners.tsx`, `Support.tsx`, `StarShield.tsx`, `StarcareLoyalty.tsx`, `WhatsAppFloat.tsx`, `Logo.tsx`, `MotionProvider.tsx`.
  - `WhatsAppFloat` é o **botão flutuante de WhatsApp** (server component): `<a>` fixo
    `bottom-6 right-6 z-50`, círculo `size-14` verde `#25D366`, glyph WhatsApp inline (mesmo do
    Header — ⚠️ glyph **duplicado** nos dois; extrair p/ ícone compartilhado se mexer de novo),
    `hover:scale-110`. Mensagem fixa "Olá, Startech!". Montado no `layout.tsx`.
  - `Header` é **`fixed` no topo** com `bg-black/30 backdrop-blur-lg` + borda inferior `border-white-8`.
    Layout: **redes sociais à esquerda** (Instagram + YouTube via `<img>` dos SVGs `/insta.svg` e
    `/youtueb.svg`, **já em branco** — insta com `fill` branco, youtube branco com o "play" vazado
    por `fill-rule="evenodd"`), **logo no centro** (absoluto), **botão WhatsApp à direita**. **Sem
    menu de navegação** — links e hambúrguer foram **removidos em definitivo** (não voltam); `nav`
    em `content/site.ts` tem só `social` + `cta`.
  - `Logo` usa o **logo oficial** `public/startech-logo.png` (PNG branco, transparente, 1249×600)
    via `next/image` (import estático). **Usar esse arquivo daqui pra frente.**
  - `FanCards` é a seção logo **abaixo da Hero**: leque 3D de imagens **parado** com hover expand
    (no mobile o `:hover` dispara no toque → tap pra expandir). **Server component** (zero JS),
    **CSS Module** (`FanCards.module.css`) em vez de Tailwind, porque é animação 3D pesada — ver Decisões.
  - `Categories` é a seção logo **abaixo do FanCards**: 2 painéis lado a lado
    (iPhones seminovos | iPhones novos) dentro do **grid central de 1200px** (`--layout-max`).
    Server component, Tailwind. **Cada painel é um link de WhatsApp** (o `<article>` virou `<a>`
    `target="_blank"`): fundo escuro padrão `bg-azul-escuro/40` + `border-white-8` + `rounded-big`,
    **hover** `bg-azul-capri/15` + `scale-[1.03]` (`duration-500`, `relative hover:z-10`) — mesmo
    padrão do StarShield. Texto centralizado no topo (título `text-h3` **28px fixo** `font-bold`),
    imagem (`/public/*.webp`, `object-contain`, `h-[400px]`) na base; "Comprar ↗" é um `<span>`
    (não `<a>` aninhado). Link via `whatsappLink(panel.cta.message)` — **mensagem pré-definida por
    card** (".../iPhones seminovos." vs ".../iPhones novos.").
  - `Partners` é a seção **abaixo da Categories**: faixa "Trabalhamos com as melhores marcas".
    Server component, dentro do grid 1200px. **Logos ainda placeholder** (logo Startech repetida
    4x). Título em `text-body2` (15px) bold. ⚠️ Trocar pelos logos reais das marcas.
  - `Support` é a seção **abaixo da Partners**: "Assistência Técnica" com **carrossel de
    serviços**. **Client component** (`"use client"`, tem estado/navegação) — único carrossel
    com JS. Mostra 1/2/3 cards por view (mobile/tablet/desktop) via `matchMedia`; setas laterais
    com navegação **de 1 em 1 item**. **Loop infinito de verdade:** lista **triplicada**
    (clones nas pontas), índice começa no bloco do meio e ao fim da transição numa ponta
    "teleporta" sem animação pro item equivalente do centro → as **setas nunca desabilitam**,
    sem bolinhas. Cada card tem **fundo escuro** (`bg-azul-escuro/40` + `border-white-8` +
    `rounded-big`, igual StarShield), `p-6` (24px), texto full-width centralizado. CTA `.btn`
    "Entrar em contato".
  - `StarShield` é a seção **abaixo do Support**: linha de proteções. Server component,
    Tailwind, dentro do grid 1200px. Cada card herda o **estilo do painel da `StarcareLoyalty`**
    (`bg-azul-escuro/40` + `border-white-8` + `rounded-big`), com **texto branco** (`text-white`
    / `text-white/60`). Layout = pilha de cards (`flex-col gap-6`): card **hero**
    full-width 2 colunas (texto + imagem) → linha **duo** (2 cards, texto em
    cima + imagem preenchendo a base) → cards **wide** (Matte, Limpa telas: texto à esquerda +
    imagem à direita) → CTA `.btn` centralizado. Imagens via `next/image` `fill` + `object-cover`.
    ⚠️ **Tudo placeholder:** imagens todas em `/images/IMG_7475.webp` e copy provisória.
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
  starshield, starcare). Editar texto só aqui. Exporta também o **WhatsApp de contato**
  (`whatsapp.number` = `5549998353002` / +55 49 99835-3002) e o helper `whatsappLink(message)`
  que monta o link `wa.me` com a mensagem já codificada. **CTAs que abrem WhatsApp** (cada um com
  sua `cta.message`, link via `whatsappLink` + `target="_blank"`): Header (`nav.cta` "Olá, Startech!"),
  Hero (`hero.cta` "Olá, Startech!"), cards da Categories (novos/seminovos), StarShield
  ("...proteger meu celular com Starshield."), Starcare ("...saber mais sobre o Startech Care") e o
  botão flutuante `WhatsAppFloat` ("Olá, Startech!"). ⚠️ `support.cta` **ainda aponta pra `#`**.
- `lib/anim.ts` — variantes de animação.
- `font/` — `.ttf` da Arboria.
- `public/images/` — fotos dos aparelhos (12 `.webp`), consumidas pelo `FanCards`
  (lista **hardcoded** no componente, em ordem crescente de nome).
- `public/` (raiz) — `seminovos.webp`/`novos.webp` (transparentes) p/ `Categories`;
  `broken.webp` (placeholder dos 4 serviços) p/ `Support`; `startech-care.webp` (logo) p/
  `StarcareLoyalty`. ⚠️ Trocar pelas imagens reais. `StarShield` reusa `images/IMG_7475.webp`
  como placeholder em todos os cards.

## Design System

> **Fonte de verdade dos tokens: `app/globals.css`.** Não hardcode valores de cor, tamanho de
> fonte, raio ou espaçamento — sempre use os tokens/utilities. Se precisar de um valor que
> não existe, adicione como token no `@theme` e registre aqui.

**Cores:** `white` #ffffff · `black` #000000 · `bg` #030B0F (fundo base do site, preto
levemente azulado) · `azul-capri` #39B6FF (primária; cards-padrão em `/15`, hover do StarShield) ·
`azul-escuro` #0A2540 (fundo dos cards do StarShield/Support e do painel da StarcareLoyalty, em
`/40`) · `realme-yellow` #F9DD60 · `cinza` #EEF0F2 (superfície clara — **token existe mas hoje
sem uso**, StarShield migrou pro tema escuro) · neutros translúcidos `white-32/16/8` e `black-32/16/8`.

**Tipografia** (Arboria; `letter-spacing` embutido nos tokens `text-*`: **títulos `h1/h2/h3`
= −0.01em**, demais = −0.03em — ver Decisões 2026-06-05):

| Estilo | Tamanho | Line-height | Peso |
|---|---|---|---|
| `text-h1` | 64 | 60 | Bold (700) |
| `text-h2` | 48 | 50 | Book (400) |
| `text-h3` | 28 | 34 | Book |
| `text-body` | 24 | 32 | Book |
| `text-body2` | 15 | 20 | Book |
| `text-feature` | 17 | 22 | Book | *(derivado — destaques do hero; ver Decisões)* |
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

**Botões:** formato pill (`border-radius: 9999px`). `.btn` (primário, fundo `azul-capri`,
texto branco bold), `.btn-sm` (variante menor), `.btn-link` ("Comprar ↗", link azul).
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
    repouso `rotateY(28deg)`, hover `scale(1.30)` + `translateZ(90px)`. Breakpoints reduzem largura
    (tablet 230 / mobile 180); leque centralizado (`justify-content: center`), `overflow-x: clip`.
  - **Peek na Hero:** `margin-top` negativo (−154 desktop / −142 tablet / **0 mobile**) pra a ponta dos
    cards "espiar" no rodapé da Hero e convidar o scroll.
  - Imagens **hardcoded** no `.tsx` (12 `.webp` de `public/images`). ⚠️ Se mudar a pasta, atualizar array.
  - **Histórico de tentativas (descartadas):** virou **marquee auto-infinito** e depois **drag-to-scroll**
    (client component, pointer events, lista duplicada), mas o cliente preferiu **voltar ao leque parado
    só com hover** — o drag deixava o expand "clicável" (o `setPointerCapture` atrapalhava o `:hover`).
  - **Valores calibrados com o cliente (desktop):** card `290px`, `margin-right: -95px` (leque aberto),
    repouso `rotateY(28deg)` (bem virado pra frente), hover `scale(1.30)` + `translateZ(90px)`.
    Breakpoints reduzem largura/deslocamento (tablet 230 / mobile 180); hover mantém `scale(1.30)`.
  - **Peek na Hero:** a seção é puxada pra cima com `margin-top` negativo (−154 desktop / −142 tablet /
    **0 no mobile** — sem peek) pra a ponta dos cards "espiar" no rodapé da Hero e convidar o scroll.
    `overflow-x: clip` (não `hidden`) mantém o eixo Y visível (hover/peek não cortam).
  - Imagens **hardcoded** no `.tsx` (12 `.webp` de `public/images`), `<img>` puro com `object-fit: cover`
    + leve dessaturação que volta no hover. ⚠️ Se adicionar/renomear arquivos na pasta, atualizar o array.
- **(2026-06-04) `Categories` — 2 painéis (Seminovos | iPhones novos) abaixo do FanCards.**
  - Primeira seção a usar o **grid central de 1200px** (`--layout-max`): a `<section>` cuida do
    padding (margin lateral + `padding-y`), e um container interno `mx-auto max-w-[var(--layout-max)]`
    segura o grid `1 → 2 colunas` com **gap fixo de 24px** (`gap-6`). Token criado pra valer na
    página inteira — aplicar nas outras seções depois.
  - Painéis: `bg-azul-capri/15` + `rounded-big` + `border-white-8`. **Texto centralizado** no topo
    (título `text-h3 md:text-h2`, descrição `text-body2`, `.btn-link` "Comprar ↗"); imagem na base
    centralizada, **`object-contain` `h-[400px]`** (sem crop, sem radius), com `pb` espelhando o `pt`.
    Imagens `seminovos.webp`/`novos.webp` na **raiz de `public/`** (transparentes).
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
    full-width 2-col → duo (2 cards) → wide (Matte / Limpa telas) → CTA. **Tokens de cor novos:**
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
  - ⚠️ **Conteúdo todo placeholder:** copy provisória e imagens (`images/IMG_7475.webp` em todo
    o StarShield; `startech-care.webp` no Starcare). Trocar pelas definitivas.
- **(2026-06-05) Letter-spacing dos títulos afrouxado.** Tokens `text-h1/h2/h3` foram de
  `-0.03em` → **`-0.01em`** (pedido do cliente: "aumentar levemente o espaço entre letras em
  todos os títulos"). Aplica-se a todas as seções automaticamente; corpo (`text-body`,
  `text-body2`, `text-feature`, etc.) **mantém −0.03em**.
- **(2026-06-05) `StarShield` v2 — tema escuro + hover.** O tema claro (cards brancos/`cinza`,
  texto escuro) foi **abandonado**: agora **cada card herda o estilo do painel da `StarcareLoyalty`**
  — `bg-azul-escuro/40` + `border-white-8` + `rounded-big`, texto **branco** (`text-white` /
  `text-white/60`). **Sem wrapper externo** (a pilha continua solta no grid 1200px, `flex-col gap-6`).
  **Hover** nos 3 tipos de card (hero / duo / wide): fundo `bg-azul-escuro/40` → **`bg-azul-capri/15`**
  (o azul dos cards menores da Starcare) + **`scale-[1.03]`**, `transition duration-500`,
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
- [x] **~~Conectar Git remoto.~~** Repo no GitHub: `felipeaitafla/startech` (`origin`, branch `main`).
- [ ] **Conectar Netlify** (link de deploy automático) — **será feito na entrega do projeto.**
- [ ] **StarShield/Starcare — conteúdo definitivo:** copy provisória e todas as imagens são
      placeholder (`images/IMG_7475.webp` no StarShield; `startech-care.webp` no Starcare).
- [ ] **Padronizar título de seção:** StarShield/Starcare usam Medium (500); as demais, Bold (700).
      Definir o padrão e uniformizar (possível `<SectionTitle>`).
- [ ] **Hover do StarShield — imagem escala junto:** no hero/wide o card inteiro (texto + imagem
      `object-cover`) faz `scale-[1.03]`. Decidir se fica assim ou se só o painel de texto muda de
      cor/escala (imagem estática).
- [ ] **Support — desalinhamento de descrição:** sem o `min-h` no título do card, serviços com
      título de 1 vs 2 linhas começam a descrição em alturas diferentes. Revisitar (talvez um
      `min-h` menor) se incomodar com a copy definitiva.
- [ ] **Support — teleporte do loop:** validar em telas lentas se o "snap" silencioso do carrossel
      infinito não pisca; se piscar, aumentar o nº de clones.
