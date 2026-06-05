import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FanCards } from "@/components/FanCards";
import { Categories } from "@/components/Categories";
import { Partners } from "@/components/Partners";
import { Support } from "@/components/Support";
import { StarShield } from "@/components/StarShield";
import { StarcareLoyalty } from "@/components/StarcareLoyalty";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <FanCards />
      <Categories />
      <Partners />
      <Support />
      <StarShield />
      <StarcareLoyalty />
    </main>
  );
}
