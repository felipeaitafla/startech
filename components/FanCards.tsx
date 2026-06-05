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

/* lista duplicada -> esteira (marquee) com loop perfeito: a animação desloca
   exatamente metade da largura (= 1 cópia), então 0 e -50% mostram o mesmo. */
const loop = [...images, ...images];

export function FanCards() {
  return (
    <section className={styles.fan}>
      {/* .track é a esteira animada; cada card tem a perspectiva embutida no transform */}
      <div className={styles.track}>
        {loop.map((src, i) => (
          <article
            key={`${src}-${i}`}
            className={styles.card}
            aria-hidden={i >= images.length ? true : undefined}
          >
            {/* <img> puro: object-fit + filter controlados no CSS module */}
            <img
              src={src}
              alt={`Smartphone seminovo ${(i % images.length) + 1}`}
              loading="lazy"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
