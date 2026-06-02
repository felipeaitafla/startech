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
- `app/page.tsx` — monta `<Header/>` + `<Hero/>`.
- `app/globals.css` — **fonte de verdade dos tokens** + base + `.btn*` + `.hero-bg`.
- `components/` — `Header.tsx`, `Hero.tsx`, `Logo.tsx`, `MotionProvider.tsx`.
  - `Header` é **`fixed` no topo** com `bg-black/30 backdrop-blur-lg` + borda inferior `border-white-8`.
  - `Logo` usa o **logo oficial** `public/startech-logo.png` (PNG branco, transparente, 1249×600)
    via `next/image` (import estático). **Usar esse arquivo daqui pra frente.**
- `content/site.ts` — **toda a copy** (nav, hero, features). Editar texto só aqui.
- `lib/anim.ts` — variantes de animação.
- `font/` — `.ttf` da Arboria.

## Design System

> **Fonte de verdade dos tokens: `app/globals.css`.** Não hardcode valores de cor, tamanho de
> fonte, raio ou espaçamento — sempre use os tokens/utilities. Se precisar de um valor que
> não existe, adicione como token no `@theme` e registre aqui.

**Cores:** `white` #ffffff · `black` #000000 · `azul-capri` #39B6FF (primária) ·
`realme-yellow` #F9DD60 · neutros translúcidos `white-32/16/8` e `black-32/16/8`.

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

## Hurdles & Correções (log)

> Registrar aqui todo obstáculo encontrado e como foi resolvido — vira histórico pra não
> repetir erro. Formato sugerido: data · problema · causa · correção.

- **(2026-06-02) Screenshot headless não captura Framer Motion.** · Problema: ao printar
  via Edge `--headless` + `--virtual-time-budget`, todo elemento animado saía em `opacity: 0`
  (página "vazia"). · Causa: o Framer Motion acelera opacity/transform via **WAAPI**, cuja
  timeline não avança com o virtual-time-budget do Chromium. Roda normal em navegador real. ·
  Correção/validação: pra conferir layout, desligar a animação temporariamente (em `lib/anim.ts`,
  `floatUp.hidden` = estado final) e religar depois. Não é bug do site.

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
