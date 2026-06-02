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

- **Next.js** (App Router).
- **Tailwind CSS v4** — config CSS-first via `@theme` no `globals.css`. Cada token vira
  ao mesmo tempo uma CSS variable e uma utility do Tailwind.
- **Fonte: Arboria** (comercial, self-hosted). Pesos usados: Book = 400, Bold = 700.
- **Deploy: Netlify**, conectado a um repositório Git (build e deploy automáticos a cada push).
  Configurar o Git desde o início — nada de deploy manual por drag-and-drop.

## Design System

> **Fonte de verdade dos tokens: `globals.css`.** Não hardcode valores de cor, tamanho de
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

## Hurdles & Correções (log)

> Registrar aqui todo obstáculo encontrado e como foi resolvido — vira histórico pra não
> repetir erro. Formato sugerido: data · problema · causa · correção.

- _(vazio — preencher conforme aparecerem)_

## Pendências

- [ ] **Confirmar versão do Tailwind.** Este projeto assume **v4** (sintaxe `@theme`). Se for v3,
      os tokens migram para `theme.extend` no `tailwind.config.js`.
- [ ] **Arboria:** hospedar os arquivos da fonte e decidir entre `@font-face` manual (já no
      `globals.css`) ou `next/font/local` (caminho mais limpo no Next, evita FOUT). Verificar a licença.
- [ ] **Ajustar dimensões reais dos botões** (padding/font-size hoje são inferidos).
