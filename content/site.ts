/* ============================================================
   COPY DO SITE — fonte única dos textos (separada do layout/JSX).
   Editar aqui não toca em estilo nem em estrutura.
   ============================================================ */

export type FeatureIcon = "warranty" | "loan" | "installments" | "support";

/* WhatsApp de contato — formato wa.me (só dígitos, com DDI 55).
   Helper monta o link já com a mensagem pré-definida codificada. */
export const whatsapp = {
  number: "5549998353002", // +55 49 99835-3002
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export const nav = {
  social: [
    { label: "Instagram", href: "#", icon: "instagram" as const },
    { label: "YouTube", href: "#", icon: "youtube" as const },
  ],
  cta: { label: "Entrar em contato", message: "Olá, Startech!" },
} as const;

export const hero = {
  title: "iPhones seminovos e lacrados, com até 2 anos de garantia",
  subtitle:
    "Loja referência em Chapecó e região: iPhones direto do canal oficial Apple, com acessórios e assistência técnica especializada.",
  cta: { label: "Falar com consultor", message: "Olá, Startech!" },
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
      title: "iPhones seminovos",
      description:
        "Nossos aparelhos são 100% originais e revisados, não trabalhamos com nada que não seja no padrão Startech de qualidade.",
      cta: {
        label: "Comprar",
        message:
          "Olá, Startech! Venho do site e desejo saber mais sobre iPhones seminovos.",
      },
      image: { src: "/seminovos.webp", alt: "iPhone seminovo Startech" },
    },
    {
      title: "iPhones novos",
      description:
        "Só trabalhamos com a versão EUA ou Anatel. Únicas a ativarem garantia de fábrica no Brasil, e caso seja necessário, nós te ajudamos.",
      cta: {
        label: "Comprar",
        message:
          "Olá, Startech! Venho do site e desejo saber mais sobre iPhones novos.",
      },
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
    {
      title: "Assistência para PC",
      description: "Notebook ou desktop, estará em boas mãos.",
      image: { src: "/broken.webp", alt: "Computador" },
    },
  ],
} as const;

/* Seção "StarShield" — linha de proteções (tema claro).
   Imagens placeholder (IMG_7475.webp) e descrições provisórias de Basic/Lens/Matte
   até virem as definitivas. */
const SS_IMG = "/images/IMG_7475.webp";

export const starshield = {
  hero: {
    title: "Proteja o seu aparelho com StarShield",
    cta: { label: "Saiba mais", href: "#" },
    image: { src: SS_IMG, alt: "StarShield" },
  },
  duo: [
    {
      title: "Basic",
      description: "Proteção essencial para o dia a dia.",
      image: { src: SS_IMG, alt: "StarShield Basic" },
    },
    {
      title: "Lens",
      description: "Proteção extra para a câmera do seu iPhone.",
      image: { src: SS_IMG, alt: "StarShield Lens" },
    },
  ],
  wide: [
    {
      title: "Matte",
      description: "Acabamento fosco, antirreflexo e antimarcas.",
      image: { src: SS_IMG, alt: "StarShield Matte" },
    },
    {
      title: "Limpa telas",
      description: "A tela do seu celular sempre limpa",
      image: { src: SS_IMG, alt: "Limpa telas StarShield" },
    },
  ],
  cta: {
    label: "Proteger meu iPhone",
    message: "Olá! Quero proteger meu celular com Starshield.",
  },
} as const;

/* Seção "Startech Care" — programa de fidelidade (card central). */
export const starcare = {
  logo: { src: "/startech-care.webp", alt: "Startech Care" },
  title: "Programa de Fidelidade",
  cta: {
    label: "Fazer parte",
    message: "Olá! Quero saber mais sobre o Startech Care.",
  },
  benefits: [
    {
      icon: "recycle" as const,
      text: "Recompra garantida do celular comprado conosco com uma tabela exclusiva de valorização! Desde que esteja nas mesmas condições.",
    },
    {
      icon: "support" as const,
      text: "Suporte Vitalício para dúvidas e Auxílio em nossas redes sociais, assim você tem alguém sempre disponível para te ajudar.",
    },
  ],
} as const;
