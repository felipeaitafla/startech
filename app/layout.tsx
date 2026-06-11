import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CursorGlow } from "@/components/CursorGlow";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

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

const SITE_TITLE = "StarTech | iPhones Seminovos e Novos em Chapecó – SC";
const SITE_DESCRIPTION =
  "iPhones seminovos e lacrados com até 2 anos de garantia, direto do canal oficial Apple. Assistência técnica especializada em Chapecó – SC. Parcele em até 18x sem juros.";

// Domínio base p/ URLs absolutas (imagem OG). Padrão = domínio de produção;
// sobrescrevível por env (definir NEXT_PUBLIC_SITE_URL no host — ex.: a URL da Vercel
// em previews: https://startech-rho.vercel.app).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://startechcelulares.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "StarTech",
  keywords: [
    "iPhone seminovo",
    "iPhone novo",
    "iPhone lacrado",
    "Chapecó",
    "assistência técnica iPhone",
    "StarTech",
    "celulares Chapecó",
  ],
  icons: {
    icon: "/icon.webp", // favicon (webp: leve, suportado por browsers modernos)
    apple: "/icon.png", // apple-touch-icon: PNG (iOS não renderiza webp p/ home screen)
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "StarTech",
    locale: "pt_BR",
    type: "website",
    url: "/",
    images: [
      {
        url: "/social.png",
        width: 1200,
        height: 630,
        alt: "StarTech — iPhones seminovos e novos em Chapecó",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/social.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={arboria.variable}>
      <body>
        {/* fundo global fixo (glow azul-capri) atrás de absolutamente tudo */}
        <div className="site-bg" aria-hidden />
        {/* smooth scroll global (gravidade da lua) — não renderiza nada */}
        <SmoothScroll />
        <MotionProvider>{children}</MotionProvider>
        <WhatsAppFloat />
        {/* cursor de luz laranja (rastro) — canvas fixo, acima de tudo, sem clique */}
        <CursorGlow />
      </body>
    </html>
  );
}
