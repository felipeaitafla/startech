import Image from "next/image";
import { MapPin, Mail, Phone, type LucideIcon } from "lucide-react";
import logo from "@/public/startech-logo.png";
import { footer, whatsappLink } from "@/content/site";

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

/* WhatsApp não existe no lucide — glyph inline (mesmo do Header/WhatsAppFloat). */
function WhatsApp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.748-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="px-[var(--layout-margin)] pb-[var(--layout-padding-y)]">
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
                        className="flex items-center gap-3 transition-colors hover:text-white"
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
                      className="text-white/80 transition-colors hover:text-white"
                    >
                      <WhatsApp className="size-6" />
                    </a>
                  ) : (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="opacity-80 transition-opacity hover:opacity-100"
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
