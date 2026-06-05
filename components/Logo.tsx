import Image from "next/image";
import logo from "@/public/startech-logo.png";

/* Logo oficial Star Tech (PNG branco, fundo transparente).
   Arquivo: /public/startech-logo.png — usar este daqui pra frente. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src={logo}
      alt="Star Tech"
      priority
      className={`h-10 w-auto select-none md:h-12 ${className}`}
    />
  );
}
