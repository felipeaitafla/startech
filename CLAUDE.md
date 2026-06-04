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
  Git **já inicializado** (branch `main`, primeiro commit feito). Falta conectar o repo
  remoto (GitHub) e linkar na Netlify.

## Estrutura de arquivos

- `app/layout.tsx` — html lang pt-BR, Arboria via next/font/local, MotionProvider, metadata.
  Monta também `<div className="site-bg">` (fundo global fixo) como 1º filho do `<body>`.
- `app/page.tsx` — monta `<Header/>` + `<Hero/>` + `<FanCards/>` + `<Categories/>` + `<Partners/>` + `<Support/>`.
- `app/globals.css` — **fonte de verdade dos tokens** + base + `.btn*` + `.site-bg` (fundo global).
- `components/` — `Header.tsx`, `Hero.tsx`, `FanCards.tsx` (+ `FanCards.module.css`), `Categories.tsx`, `Partners.tsx`, `Support.tsx`, `Logo.tsx`, `MotionProvider.tsx`.
  - `Header` é **`fixed` no topo** com `bg-black/30 backdrop-blur-lg` + borda inferior `border-white-8`.
  - `Logo` usa o **logo oficial** `public/startech-logo.png` (PNG branco, transparente, 1249×600)
    via `next/image` (import estático). **Usar esse arquivo daqui pra frente.**
  - `FanCards` é a seção logo **abaixo da Hero**: leque 3D de imagens em **carrossel
    arrastável** (drag-to-scroll, sem auto-play) com hover expand. **Client component**
    (drag via pointer events); leque/hover em **CSS Module** (`FanCards.module.css`) — ver Decisões.
  - `Categories` é a seção logo **abaixo do FanCards**: 2 painéis lado a lado
    (Seminovos | iPhones novos) dentro do **grid central de 1200px** (`--layout-max`).
    Server component, Tailwind. Painéis `bg-azul-capri/15` + `rounded-big` + `border-white-8`;
    texto centralizado no topo, imagem (`/public/*.webp`, `object-contain`, `h-[400px]`) na base.
  - `Partners` é a seção **abaixo da Categories**: faixa "Trabalhamos com as melhores marcas".
    Server component, dentro do grid 1200px. **Logos ainda placeholder** (logo Startech repetida
    4x). Título em `text-body2` (15px) bold. ⚠️ Trocar pelos logos reais das marcas.
  - `Support` é a seção **abaixo da Partners**: "Assistência Técnica" com **carrossel de
    serviços**. **Client component** (`"use client"`, tem estado/navegação) — único carrossel
    com JS. Mostra 1/2/4 cards por view (mobile/tablet/desktop) via `matchMedia`; setas laterais
    + bolinhas, navegação por página com wrap-around. CTA `.btn` "Entrar em contato" no fim.
- `content/site.ts` — **toda a copy** (nav, hero, features, categories, partners, support).
  Editar texto só aqui.
- `lib/anim.ts` — variantes de animação.
- `font/` — `.ttf` da Arboria.
- `public/images/` — fotos dos aparelhos (12 `.webp`), consumidas pelo `FanCards`
  (lista **hardcoded** no componente, em ordem crescente de nome).
- `public/` (raiz) — `seminovos.webp`/`novos.webp` (transparentes) p/ `Categories`;
  `broken.webp` (placeholder dos 4 serviços) p/ `Support`. ⚠️ Trocar pelas imagens reais.

## Design System

> **Fonte de verdade dos tokens: `app/globals.css`.** Não hardcode valores de cor, tamanho de
> fonte, raio ou espaçamento — sempre use os tokens/utilities. Se precisar de um valor que
> não existe, adicione como token no `@theme` e registre aqui.

**Cores:** `white` #ffffff · `black` #000000 · `bg` #030B0F (fundo base do site, preto
levemente azulado) · `azul-capri` #39B6FF (primária) · `realme-yellow` #F9DD60 ·
neutros translúcidos `white-32/16/8` e `black-32/16/8`.

**Tipografia** (Arboria, `letter-spacing: -0.03em` em todos — já embutido nos tokens `text-*`):

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
- **(2026-06-04) `FanCards` — leque 3D em carrossel arrastável abaixo da Hero.** Fotos dos aparelhos
  como um baralho inclinado que **só rola quando o usuário arrasta** (sem auto-play); no hover o card
  endireita e amplia.
  - Leque/hover em **CSS Module** (`FanCards.module.css`), não Tailwind: efeito 3D com muitos estados
    encadeados (perspectiva, `transform-origin`, seletores de irmãos) que ficaria ilegível em utilities.
    **Client component** (`"use client"`) — o arraste precisa de JS (pointer events).
  - Mecânica do leque: **perspectiva no pai `.fan`** (`perspective: 2000px`); cards com
    `transform-origin: left center` + `rotateY` (repouso) que abrem como leque; **sobreposição via
    `margin-right` negativo**; os cards à direita do hovered deslocam com `.card:hover ~ .card
    { translateX }` pra abrir espaço. Transição `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
  - **Drag-to-scroll (sem auto-play):** o `.track` translada via **pointer events** (mouse + touch);
    `pos`/estado do arraste em `useRef` (sem re-render por movimento), `transform` setado direto no DOM.
    **Loop sem emenda:** lista **duplicada no JSX** (2ª cópia `aria-hidden`) + `translateX` "embrulhado"
    no comprimento de uma cópia → arrasta infinito nos dois sentidos. `cursor: grab/grabbing`,
    `touch-action: pan-y` (deixa o scroll vertical da página passar), `user-select`/`draggable=false`
    (sem fantasma de imagem). Como os cards são netos, `.track` tem `transform-style: preserve-3d`.
    ⚠️ Sem inércia/momentum (para ao soltar) — adicionar depois se quiserem deslize.
  - **Decisão (2026-06-04):** começou como **marquee auto-infinito** (`fan-scroll` keyframes), mas o
    cliente pediu **só ao arrastar** — animação CSS removida, virou client component com drag.
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
  - `Support`: **client component** (estado de página + `matchMedia`), único carrossel com JS.
    1/2/4 cards por view (mobile/tablet/desktop); track `translateX(-página*100%)` com transição
    `cubic-bezier(...)`; **setas** fora da área dos cards (layout `[seta][viewport][seta]`) com
    wrap-around; **bolinhas** (ativa em `azul-capri`); CTA `.btn` no fim. Card: título reserva
    **2 linhas** (`min-h-[64px]`) pra alinhar descrição/imagem entre cards; imagem `object-contain
    h-[180px]`; sem fundo/borda no card (texto até a borda). ⚠️ Com 4 serviços e 4-por-view, o
    desktop tem **1 página só** (setas/bolinhas sem destino) — consequência de 4×4.
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
- [ ] **Menu mobile:** o botão hambúrguer do Header existe mas ainda não abre nada.
- [ ] **Validar contra o Figma:** o Hero foi feito a partir do screenshot; conferir medidas/cores
      exatas quando o frame do Figma estiver à mão.
- [ ] **Conectar Git remoto + Netlify** (repo GitHub e link de deploy automático).
