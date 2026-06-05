import React from "react";

/* Realça trechos dentro de um texto: cada substring listada em `phrases`
   vira um <span> branco 100% (text-white), sobrepondo a cor/opacidade
   herdada do parágrafo. O resto do texto mantém a cor do elemento pai.
   Uso: {highlight(texto, ["trecho em destaque"])}. */
export function highlight(
  text: string,
  phrases?: readonly string[]
): React.ReactNode {
  if (!phrases || phrases.length === 0) return text;

  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");

  return text.split(re).map((part, i) =>
    phrases.includes(part) ? (
      <span key={i} className="text-white">
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}
