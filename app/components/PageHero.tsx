import Image from "next/image";
import Link from "next/link";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  current: string;
  imageAlt?: string;
  imagePosition?: string;
  compact?: boolean;
  accent?: "red" | "indigo" | "cyan";
};

export function PageHero({ eyebrow, title, description, image, current, imageAlt = "", imagePosition, compact = false, accent }: PageHeroProps) {
  return (
    <section className={`inner-hero${compact ? " inner-hero--compact" : ""}${accent ? ` inner-hero--${accent}` : ""}`} aria-labelledby="page-title">
      <div className="inner-hero-media" aria-hidden={imageAlt ? undefined : true}>
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" style={imagePosition ? { objectPosition: imagePosition } : undefined} />
      </div>
      <div className="inner-hero-overlay" aria-hidden="true" />
      <div className="container inner-hero-content">
        <nav className="breadcrumbs" aria-label="Sayfa yolu">
          <Link href="/">Anasayfa</Link><span aria-hidden="true">/</span><span>{current}</span>
        </nav>
        <p className="inner-eyebrow inner-eyebrow--light">{eyebrow}</p>
        <h1 id="page-title">{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
