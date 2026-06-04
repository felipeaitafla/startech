import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";

/* Arboria — self-hosted via next/font/local (expõe --font-arboria,
   consumida por --font-sans no globals.css). */
const arboria = localFont({
  src: [
    { path: "../font/arboria-light.ttf", weight: "300", style: "normal" },
    { path: "../font/arboria-book.ttf", weight: "400", style: "normal" },
    { path: "../font/arboria-medium.ttf", weight: "500", style: "normal" },
    { path: "../font/arboria-bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-arboria",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Star Tech — Smartphones seminovos e lacrados com 1 ano de garantia",
  description:
    "Loja referência em Chapecó e região na venda de smartphones, acessórios e assistência técnica especializada.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={arboria.variable}>
      <body>
        {/* fundo global fixo (glow azul-capri) atrás de absolutamente tudo */}
        <div className="site-bg" aria-hidden />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
