import Image from "next/image";
import { MapPin, Mail, Phone, type LucideIcon } from "lucide-react";
import logo from "@/public/startech-logo.png";
import { footer, whatsappLink } from "@/content/site";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

const contactIcons: Record<"location" | "email" | "phone", LucideIcon> = {
  location: MapPin,
  email: Mail,
  phone: Phone,
};

/* ícones brancos vindos de /public (svg já em branco) */
const socialImg: Record<string, string> = {
  instagram: "/insta.svg",
  youtube: "/youtueb.svg",
};

export function Footer() {
  return (
    <footer className="px-[var(--layout-margin)] pb-12">
      <div className="mx-auto w-full max-w-[var(--layout-max)]">
        {/* card do rodapé — fundo escuro levemente diferente da página + borda sutil */}
        <div className="rounded-big border border-white-8 bg-azul-escuro/40 p-8 md:p-12">
          <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-center md:justify-between md:gap-8 md:text-left">
            {/* coluna 1 — logo */}
            <Image
              src={logo}
              alt="Star Tech"
              className="h-16 w-auto shrink-0 select-none md:h-20"
            />

            {/* coluna 2 — contato */}
            <ul className="flex flex-col gap-3">
              {footer.contact.map((item) => {
                const Icon = contactIcons[item.icon];
                const inner = (
                  <>
                    <Icon
                      className="size-4 shrink-0 text-azul-capri"
                      strokeWidth={1.75}
                    />
                    <span>{item.text}</span>
                  </>
                );
                return (
                  <li
                    key={item.text}
                    className="text-footer flex items-center justify-center gap-3 text-white/60 md:justify-start"
                  >
                    {"href" in item ? (
                      <a
                        href={item.href}
                        className="flex items-center gap-3 transition-colors ease-in-out hover:text-white"
                      >
                        {inner}
                      </a>
                    ) : (
                      <span className="flex items-center gap-3">{inner}</span>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* coluna 3 — redes sociais + copyright */}
            <div className="flex flex-col items-center gap-4 md:items-end">
              <div className="flex items-center gap-4">
                {footer.social.map((s) =>
                  s.icon === "whatsapp" ? (
                    <a
                      key={s.label}
                      href={whatsappLink(s.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="text-white/80 transition-colors ease-in-out hover:text-white"
                    >
                      <WhatsAppGlyph className="size-6" />
                    </a>
                  ) : (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="opacity-80 transition-opacity ease-in-out hover:opacity-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={socialImg[s.icon]}
                        alt={s.label}
                        className="h-6 w-auto"
                      />
                    </a>
                  )
                )}
              </div>
              <div className="text-white/50 md:text-right">
                {footer.copyright.map((line) => (
                  <p key={line} className="text-[11px] whitespace-nowrap sm:text-footer">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
