import styles from "./FanCards.module.css";

/* Imagens lidas direto de /public/images — todos os arquivos da pasta.
   (hardcoded de propósito; trocar aqui se a pasta mudar.) */
const images = [
  "/images/IMG_5040.webp",
  "/images/IMG_5043.webp",
  "/images/IMG_5044.webp",
  "/images/IMG_7421.webp",
  "/images/IMG_7425.webp",
  "/images/IMG_7437.webp",
  "/images/IMG_7475.webp",
  "/images/IMG_7495.webp",
  "/images/IMG_7496.webp",
  "/images/IMG_7498.webp",
  "/images/IMG_7501.webp",
  "/images/IMG_7507.webp",
];

export function FanCards() {
  return (
    <section className={styles.fan}>
      {images.map((src, i) => (
        <article key={src} className={styles.card}>
          {/* <img> puro: object-fit + filter controlados no CSS module */}
          <img src={src} alt={`Smartphone seminovo ${i + 1}`} loading="lazy" />
        </article>
      ))}
    </section>
  );
}
