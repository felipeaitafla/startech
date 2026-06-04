import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FanCards } from "@/components/FanCards";
import { Categories } from "@/components/Categories";
import { Partners } from "@/components/Partners";
import { Support } from "@/components/Support";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <FanCards />
      <Categories />
      <Partners />
      <Support />
    </main>
  );
}
