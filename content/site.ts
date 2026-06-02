/* ============================================================
   COPY DO SITE — fonte única dos textos (separada do layout/JSX).
   Editar aqui não toca em estilo nem em estrutura.
   ============================================================ */

export type FeatureIcon = "warranty" | "loan" | "installments" | "support";

export const nav = {
  links: [
    { label: "iPhone", href: "#" },
    { label: "Android", href: "#" },
    { label: "Assistência", href: "#" },
    { label: "StarShield", href: "#" },
    { label: "StartechCare", href: "#" },
    { label: "Acessórios", href: "#" },
  ],
  social: [
    { label: "Instagram", href: "#", icon: "instagram" as const },
    { label: "YouTube", href: "#", icon: "youtube" as const },
  ],
  cta: { label: "Entrar em contato", href: "#" },
} as const;

export const hero = {
  title: "iPhones seminovos e lacrados, com até 2 anos de garantia",
  subtitle:
    "Loja referência em Chapecó e região: iPhones direto do canal oficial Apple, com acessórios e assistência técnica especializada.",
  cta: { label: "Falar com consultor", href: "#" },
  features: [
    {
      icon: "warranty" as FeatureIcon,
      text: "Até 2 anos de garantia em todos os iPhones seminovos",
    },
    {
      icon: "loan" as FeatureIcon,
      text: "Emprestamos outro aparelho enquanto o seu está na garantia",
    },
    {
      icon: "installments" as FeatureIcon,
      text: "Parcelamento em até 12x sem juros",
    },
    {
      icon: "support" as FeatureIcon,
      text: "Assistência técnica com especialistas",
    },
  ],
} as const;
