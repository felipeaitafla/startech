import { Logo } from "@/components/Logo";
import { partners } from "@/content/site";

export function Partners() {
  return (
    <section className="px-[var(--layout-margin)] pb-[var(--layout-padding-y)]">
      {/* 128px de respiro acima, abaixo dos cards */}
      <div className="mx-auto w-full max-w-[var(--layout-max)] pt-[128px]">
        <h2 className="text-body2 text-center text-white">
          {partners.title}
        </h2>

        {/* logos placeholder — repetição da logo Startech até termos os reais */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {Array.from({ length: partners.count }).map((_, i) => (
            <Logo key={i} className="h-14 md:h-16" />
          ))}
        </div>
      </div>
    </section>
  );
}
