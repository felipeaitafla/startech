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
  // trechos do subtítulo que vão para branco 100%
  subtitleHighlights: ["Loja referência em Chapecó e região"],
  cta: { label: "Falar com consultor", message: "Olá, Startech!" },
  features: [
    {
      icon: "warranty" as FeatureIcon,
      text: "Até 2 anos de garantia em todos os iPhones seminovos",
      highlights: ["Até 2 anos de garantia"], // trecho em branco 100%
      textWidth: 180, // px — ajustar para forçar quebra de linha desejada
    },
    {
      icon: "loan" as FeatureIcon,
      text: "Emprestamos outro aparelho enquanto o seu está na garantia",
      highlights: ["Emprestamos outro aparelho"],
      textWidth: 210,
    },
    {
      icon: "installments" as FeatureIcon,
      text: "Parcelamento em até 12x sem juros",
      highlights: ["12x sem juros"],
      textWidth: 120,
    },
    {
      icon: "support" as FeatureIcon,
      text: "Assistência técnica com especialistas",
      highlights: ["Assistência", "especialistas"],
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
      image: { src: "/iphones/seminovos.webp", alt: "iPhone seminovo Startech" },
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
      image: { src: "/iphones/novos.webp", alt: "iPhone novo lacrado" },
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
   Imagens reais em /public/assistencia (nome casa com cada serviço). */
export const support = {
  title: "Assistência Técnica",
  subtitle:
    "10 anos de experiência na assistência técnica de celulares e computadores",
  cta: {
    label: "Entrar em contato",
    message: "Olá, Startech! Vim do site e gostaria de assistência técnica",
  },
  services: [
    {
      title: "Troca de Tela",
      description: "Simples, rápido e seguro, como deve ser.",
      image: { src: "/assistencia/tela.webp", alt: "Tela trincada" },
    },
    {
      title: "Reparo em placa",
      description:
        "Nossos especialistas técnicos estão aptos a resolver o seu problema.",
      image: { src: "/assistencia/placa.webp", alt: "Placa-mãe" },
    },
    {
      title: "Troca de Bateria",
      description: "Garantimos a troca segura da sua bateria.",
      image: { src: "/assistencia/bateria.webp", alt: "Bateria" },
    },
    {
      title: "Transferência de Dados",
      description: "Tudo feito de forma segura e transparente.",
      image: { src: "/assistencia/transfere.webp", alt: "iPhone com ícone de transferência" },
    },
    {
      title: "Assistência para PC",
      description: "Notebook ou desktop, estará em boas mãos.",
      image: { src: "/assistencia/pc.webp", alt: "Computador" },
    },
  ],
} as const;

/* Seção "StarShield" — linha de proteções.
   Imagens reais em /public/starshield (nome casa com cada card). Descrições
   de Basic/Lens/Matte ainda provisórias até virem as definitivas. */
export const starshield = {
  hero: {
    title: "Proteja o seu aparelho com",
    logo: { src: "/starshield-logo.webp", alt: "StarShield", width: 4321, height: 514 },
    cta: { label: "Saiba mais", href: "#" },
    image: { src: "/starshield/intro.webp", alt: "StarShield", width: 1089, height: 598 },
  },
  duo: [
    {
      title: "Basic",
      description: "Proteção essencial para o dia a dia.",
      image: { src: "/starshield/pelicula.webp", alt: "StarShield Basic (película)", width: 810, height: 600 },
    },
    {
      title: "Lens",
      description: "Proteção extra para a câmera do seu iPhone.",
      image: { src: "/starshield/lens.webp", alt: "StarShield Lens", width: 810, height: 600 },
    },
  ],
  wide: [
    {
      title: "Matte",
      description: "Acabamento fosco, antirreflexo e antimarcas.",
      image: { src: "/starshield/matte.webp", alt: "StarShield Matte", width: 789, height: 600 },
    },
    {
      title: "Limpa telas",
      description: "A tela do seu celular sempre limpa",
      image: { src: "/starshield/limpa-telas.webp", alt: "Limpa telas StarShield", width: 1067, height: 600 },
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

/* Seção "Acessórios" — bento grid de 4 imagens (sem texto sobre elas).
   ⚠️ Imagens placeholder de /public/images até termos as reais dos acessórios. */
export const acessorios = {
  title: "Acessórios incríveis para o seu dia a dia",
  cta: {
    label: "Comprar",
    message: "Olá, Startech! Gostaria de saber mais sobre os acessórios.",
  },
  // ordem: [grande (esq), topo dir, inferior dir esq, inferior dir dir]
  images: [
    { src: "/acessorios/1-capinha.webp", alt: "Capinha de iPhone" },
    { src: "/acessorios/2-capinha-kit.webp", alt: "Kit de capinhas" },
    { src: "/acessorios/3-carregador.webp", alt: "Carregador" },
    { src: "/acessorios/4-fone.webp", alt: "Fone de ouvido" },
  ],
} as const;

/* Seção "Instagram" — chamada (esquerda) + grade de posts (direita).
   ⚠️ Só a COPY mora aqui; os POSTS ficam hardcoded no componente
   (`instagramPosts`), destinados à futura integração com a API (Behold). */
export const instagram = {
  handle: "@startechcelulares",
  title: "Confira nosso Instagram",
  profileUrl: "https://instagram.com/startechcelulares",
  // duas linhas de pills/tags (sem clique)
  tags: [
    ["Dicas", "Ofertas", "Orientações"],
    ["Bastidores", "Humor", "Novidades"],
  ],
} as const;

/* Seção "Vem conhecer" — card 2 colunas (texto + carrossel automático) antes da CTA. */
export const visit = {
  title: "Vem conhecer a Startech.",
  items: [
    { icon: "star" as const, text: "Avaliação 5 estrelas" },
    {
      icon: "location" as const,
      text: "Av. Fernando Machado, 30e — Centro, Chapecó – SC",
    },
  ],
  // carrossel automático (troca a cada 2.3s, sem setas)
  images: [
    { src: "/loja/loja.webp", alt: "Loja Startech em Chapecó" },
    { src: "/loja/close-up.webp", alt: "Atendimento na Startech" },
    { src: "/loja/fotos-clientes.webp", alt: "Clientes da Startech" },
  ],
} as const;

/* CTA final — título grande centralizado + botão, com bastante respiro. */
export const finalCta = {
  title: "Faça uma escolha inteligente. iPhone seminovo é na Startech",
  subtitle: "Te ajudamos a escolher o iPhone perfeito para você.",
  subtitleHighlights: ["iPhone perfeito para você"], // trecho em branco 100%
  cta: {
    label: "Falar com consultor",
    message: "Olá, Startech!",
  },
} as const;

/* Rodapé — contato, redes sociais e copyright. */
export const footer = {
  contact: [
    {
      icon: "location" as const,
      text: "Av. Fernando Machado, 30e — Centro, Chapecó – SC",
    },
    {
      icon: "email" as const,
      text: "atendimento@startechcelulares.com",
      href: "mailto:atendimento@startechcelulares.com",
    },
    {
      icon: "phone" as const,
      text: "49 9 9835 3002",
      href: "tel:+5549998353002",
    },
  ],
  // redes: whatsapp usa wa.me; insta/youtube usam os SVGs brancos de /public
  social: [
    { label: "WhatsApp", icon: "whatsapp" as const, message: "Olá, Startech!" },
    { label: "Instagram", icon: "instagram" as const, href: "#" },
    { label: "YouTube", icon: "youtube" as const, href: "#" },
  ],
  copyright: [
    "© 2024 StarTech. Todos os direitos reservados.",
    "CNPJ 33.137.998/0001-20",
  ],
} as const;
