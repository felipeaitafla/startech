import { whatsappLink } from "@/content/site";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

/* Botão flutuante de WhatsApp — fixo no canto inferior direito, sobre tudo.
   Abre o WhatsApp com a mensagem padrão "Olá, Startech!". */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Olá, Startech!")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition duration-300 ease-in-out hover:scale-110 hover:bg-[#1ebe5a]"
    >
      <WhatsAppGlyph className="size-7" />
    </a>
  );
}
