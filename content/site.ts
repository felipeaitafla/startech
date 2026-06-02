/* ============================================================
   COPY DO SITE — fonte única dos textos (separada do layout/JSX).
   Editar aqui não toca em estilo nem em estrutura.
   ============================================================ */

export type FeatureIcon = "battery" | "loan" | "installments" | "support";

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
  title: "Smartphones seminovos e lacrados com 1 ano de garantia",
  subtitle:
    "Somos uma loja referência em Chapecó e região na venda de smartphones, acessórios e assistência técnica especializada.",
  cta: { label: "Saiba mais", href: "#" },
  features: [
    {
      icon: "battery" as FeatureIcon,
      text: "Somos a única loja do Brasil a oferecer garantia de saúde para a sua bateria",
    },
    {
      icon: "loan" as FeatureIcon,
      text: "Emprestamos outro aparelho para você se o seu estiver na garantia",
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
