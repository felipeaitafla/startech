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
      textWidth: 200, // px — ajustar para forçar quebra de linha desejada
    },
    {
      icon: "loan" as FeatureIcon,
      text: "Emprestamos outro aparelho enquanto o seu está na garantia",
      textWidth: 230,
    },
    {
      icon: "installments" as FeatureIcon,
      text: "Parcelamento em até 12x sem juros",
      textWidth: 130,
    },
    {
      icon: "support" as FeatureIcon,
      text: "Assistência técnica com especialistas",
      textWidth: 130,
    },
  ],
} as const;

/* Seção de 2 painéis (Seminovos | iPhones novos) logo abaixo do FanCards. */
export const categories = {
  panels: [
    {
      title: "Seminovos",
      description:
        "Nossos aparelhos são 100% originais e revisados, não trabalhamos com nada que não seja no padrão Startech de qualidade.",
      cta: { label: "Comprar", href: "#" },
      image: { src: "/seminovos.webp", alt: "iPhone seminovo Startech" },
    },
    {
      title: "iPhones novos",
      description:
        "Só trabalhamos com a versão EUA ou Anatel. Únicas a ativarem garantia de fábrica no Brasil, e caso seja necessário, nós te ajudamos.",
      cta: { label: "Comprar", href: "#" },
      image: { src: "/novos.webp", alt: "iPhone novo lacrado" },
    },
  ],
} as const;

/* Seção "partners" — faixa de marcas parceiras. Logos ainda placeholder
   (repetição da logo Startech) até termos os logos reais. */
export const partners = {
  title: "Trabalhamos com as melhores marcas",
  count: 4,
} as const;

/* Seção "Assistência Técnica" — carrossel de serviços.
   Imagens placeholder (broken.webp) até termos as reais de cada serviço. */
export const support = {
  title: "Assistência Técnica",
  subtitle:
    "10 anos de experiência na assistência técnica de celulares e computadores",
  cta: { label: "Entrar em contato", href: "#" },
  services: [
    {
      title: "Troca de Tela",
      description: "Simples, rápido e seguro, como deve ser.",
      image: { src: "/broken.webp", alt: "Tela trincada" },
    },
    {
      title: "Reparo em placa",
      description:
        "Nossos especialistas técnicos estão aptos a resolver o seu problema.",
      image: { src: "/broken.webp", alt: "Placa-mãe" },
    },
    {
      title: "Troca de Bateria",
      description: "Garantimos a troca segura da sua bateria.",
      image: { src: "/broken.webp", alt: "Bateria" },
    },
    {
      title: "Transferência de Dados",
      description: "Tudo feito de forma segura e transparente.",
      image: { src: "/broken.webp", alt: "iPhone com ícone de transferência" },
    },
  ],
} as const;
