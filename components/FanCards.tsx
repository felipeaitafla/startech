"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import styles from "./FanCards.module.css";

/* Imagens lidas direto de /public/images — todos os arquivos da pasta.
   (hardcoded de propósito; trocar aqui se a pasta mudar.) */
const images = [
  "/images/IMG_5040.webp",
  "/images/IMG_5043.webp",
  "/images/IMG_5044.webp",
  "/images/IMG_7421.webp",
  "/images/IMG_7425.webp",
  "/images/IMG_7437.webp",
  "/images/IMG_7475.webp",
  "/images/IMG_7495.webp",
  "/images/IMG_7496.webp",
  "/images/IMG_7498.webp",
  "/images/IMG_7501.webp",
  "/images/IMG_7507.webp",
];

/* duplicado: a 2ª cópia (aria-hidden) permite o loop sem emenda ao arrastar
   — o translateX é "embrulhado" no intervalo de uma cópia. */
const loop = [...images, ...images];

export function FanCards() {
  const trackRef = useRef<HTMLDivElement>(null);
  // estado do arraste em ref (não dispara re-render a cada movimento)
  const drag = useRef({ active: false, startX: 0, pos: 0, startPos: 0, copyW: 0 });

  // aplica o translateX embrulhado no comprimento de UMA cópia -> infinito
  const apply = () => {
    const el = trackRef.current;
    if (!el) return;
    const w = drag.current.copyW || (drag.current.copyW = el.scrollWidth / 2);
    let x = drag.current.pos % w;
    if (x > 0) x -= w; // mantém em (-w, 0]
    el.style.transform = `translateX(${x}px)`;
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.startPos = drag.current.pos;
    trackRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.pos = drag.current.startPos + (e.clientX - drag.current.startX);
    apply();
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <section className={styles.fan}>
      <div
        ref={trackRef}
        className={styles.track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {loop.map((src, i) => {
          const isClone = i >= images.length;
          return (
            <article key={i} className={styles.card} aria-hidden={isClone}>
              <img
                src={src}
                alt={isClone ? "" : `Smartphone seminovo ${i + 1}`}
                loading="lazy"
                draggable={false}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
