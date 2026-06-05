import { whatsappLink } from "@/content/site";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

type Props = {
  /** mensagem pré-definida que vai no link wa.me */
  message: string;
  /** texto do botão */
  label: string;
  /** tamanho do pill: "md" (.btn) ou "sm" (.btn .btn-sm) */
  size?: "md" | "sm";
  /** classes extras no <a> */
  className?: string;
  /** classes extras no rótulo (ex.: esconder no mobile) */
  labelClassName?: string;
};

/* CTA de WhatsApp — pill (.btn) com o glyph num círculo branco colado à
   esquerda (.btn-icon). Abre o wa.me com a mensagem pré-definida. */
export function WhatsAppButton({
  message,
  label,
  size = "md",
  className,
  labelClassName,
}: Props) {
  const classes = [size === "sm" ? "btn btn-sm" : "btn", className]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
    >
      <span className="btn-icon">
        <WhatsAppGlyph />
      </span>
      <span className={labelClassName}>{label}</span>
    </a>
  );
}
