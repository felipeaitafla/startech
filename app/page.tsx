import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FanCards } from "@/components/FanCards";
import { Categories } from "@/components/Categories";
// import { Partners } from "@/components/Partners"; // seção oculta (a pedido)
import { Support } from "@/components/Support";
import { StarShield } from "@/components/StarShield";
import { StarcareLoyalty } from "@/components/StarcareLoyalty";
import { Acessorios } from "@/components/Acessorios";
import { InstagramFeed } from "@/components/InstagramFeed";
import { VisitStartech } from "@/components/VisitStartech";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      {/* Hero anima no load; FanCards é esteira contínua (peek na Hero) —
          ambos ficam fora do Reveal. As demais entram ao chegar no scroll. */}
      <Hero />
      <FanCards />
      <Reveal>
        <Categories />
      </Reveal>
      {/* <Partners /> — seção oculta (a pedido) */}
      <Reveal>
        <Support />
      </Reveal>
      {/* StarShield faz o próprio reveal em cascata (stagger interno) — sem <Reveal> */}
      <StarShield />
      <Reveal>
        <StarcareLoyalty />
      </Reveal>
      <Reveal>
        <Acessorios />
      </Reveal>
      <Reveal>
        <InstagramFeed />
      </Reveal>
      <Reveal>
        <VisitStartech />
      </Reveal>
      <Reveal>
        <FinalCta />
      </Reveal>
      <Reveal>
        <Footer />
      </Reveal>
    </main>
  );
}
