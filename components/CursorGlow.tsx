"use client";

import { useEffect, useRef } from "react";

/* CursorGlow — "cursor de luz" laranja com rastro suave.
   Canvas fixo em tela cheia (pointer-events-none, acima de tudo). NÃO substitui
   o cursor nativo: é um brilho que o ACOMPANHA.

   Mecânica (loop rAF):
   • `head` persegue o mouse com lerp (lag) → suavidade.
   • a cada frame deixa um ponto na posição da cabeça e decai a "vida" dos antigos
     → rastro que afina e some.
   • cada ponto é um gradiente radial laranja desenhado com `globalCompositeOperation
     = "lighter"` (soma de luz) → brilho/bloom em vez de bolinha sólida.

   Só ativa em ponteiro fino (mouse) e respeita "reduzir movimento". Montado no
   layout.tsx. P/ ajustar: COLOR (cor), DECAY (tamanho do rastro), os raios/alphas. */

const COLOR = { r: 255, g: 122, b: 26 }; // laranja #FF7A1A
const DECAY = 0.06; // quanto a vida cai por frame (menor = rastro mais longo)
const LERP = 0.16; // suavização da cabeça (menor = mais "arrastado"/suave)
const MAX_POINTS = 34;
const MIN_DIST = 2.5; // só cria ponto se a cabeça andou isto (evita acúmulo parado)

export function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // esconde o cursor nativo só enquanto este efeito está ativo (a luz vira o cursor)
    document.documentElement.classList.add("cursor-glow-active");

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const head = { x: mouse.x, y: mouse.y };
    let moved = false;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      moved = true;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    type Point = { x: number; y: number; life: number };
    const points: Point[] = [];
    const last = { x: head.x, y: head.y };

    const rgba = (a: number) => `rgba(${COLOR.r},${COLOR.g},${COLOR.b},${a})`;

    let rafId = 0;
    const draw = () => {
      head.x += (mouse.x - head.x) * LERP;
      head.y += (mouse.y - head.y) * LERP;

      // só deixa rastro se a cabeça realmente andou (sem acúmulo com mouse parado)
      if (moved) {
        const dx = head.x - last.x;
        const dy = head.y - last.y;
        if (dx * dx + dy * dy > MIN_DIST * MIN_DIST) {
          points.push({ x: head.x, y: head.y, life: 1 });
          if (points.length > MAX_POINTS) points.shift();
          last.x = head.x;
          last.y = head.y;
        }
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter"; // soma de luz = brilho

      for (const p of points) {
        p.life -= DECAY;
        if (p.life <= 0) continue;
        const radius = 24 * p.life + 5; // tamanho do rastro
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, rgba(p.life * 0.22)); // menos luminoso (era 0.5)
        grad.addColorStop(1, rgba(0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      while (points.length && points[0].life <= 0) points.shift();

      // núcleo na cabeça — laranja (não branco) p/ ler como ponteiro, sem amarelar
      const coreR = 10;
      const core = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, coreR);
      core.addColorStop(0, rgba(0.8));
      core.addColorStop(1, rgba(0));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(head.x, head.y, coreR, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("cursor-glow-active");
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  );
}
