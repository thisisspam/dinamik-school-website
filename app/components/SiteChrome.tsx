import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { siteNavigation } from "./navigation";
import { ScrollAwareHeader } from "./ScrollAwareHeader";
import { getSiteSettings } from "../../lib/content";
import { createWhatsappHref } from "../../lib/whatsapp";

export function SiteHeader() {
  return (
    <ScrollAwareHeader>
      <div className="container header-inner">
        <Link className="brand brand--header" href="/" aria-label="Dinamik Okulları anasayfa">
          <Image
            className="brand-image"
            src="/images/dinamik-logo-retina.png"
            alt="Dinamik Okulları"
            width={170}
            height={77}
            sizes="142px"
            priority
            unoptimized
          />
        </Link>
        <DesktopNavigation navigation={siteNavigation} />
        <div className="header-actions">
          <Link className="button button--header" href="/on-kayit">
            Ön Kayıt
          </Link>
          <a
            className="button button--ghost-dark"
            href="https://e-okul.meb.gov.tr/"
            target="_blank"
            rel="noreferrer"
          >
            e-Okul <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
        <MobileNavigation navigation={siteNavigation} ctaHref="/on-kayit" />
      </div>
    </ScrollAwareHeader>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const landlineTel = `tel:+9${settings.landlinePhone.replace(/\D/g, "")}`;
  const whatsappHref = createWhatsappHref(settings.whatsapp);

  return (
    <>
      <footer className="site-footer inner-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <Link className="brand brand--footer" href="/" aria-label="Dinamik Okulları anasayfa">
              <Image src="/images/footer-logo-dinamik.png" alt="Dinamik Okulları" width={125} height={35} unoptimized />
            </Link>
            <p>Meslek sahibi, gelecek sahibi.</p>
            <div className="inner-footer-social">
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>
          <div className="footer-links">
            <strong>Okulumuz</strong>
            <Link href="/hakkimizda">Hakkımızda</Link>
            <Link href="/kadromuz">Kadromuz</Link>
            <Link href="/okul-kiyafetlerimiz">Okul Kıyafetleri</Link>
            <Link href="/rehberlik">Rehberlik</Link>
          </div>
          <div className="footer-links">
            <strong>Keşfet</strong>
            <Link href="/bolumler">Bölümlerimiz</Link>
            <Link href="/faaliyetlerimiz">Faaliyetlerimiz</Link>
            <Link href="/galeri">Galeri</Link>
            <Link href="/basarilarimiz">Başarılarımız</Link>
          </div>
          <address className="inner-footer-contact">
            <strong>İletişim</strong>
            <a href={landlineTel}><Phone size={15} />{settings.landlinePhone}</a>
            <a href={`mailto:${settings.email}`}><Mail size={15} />{settings.email}</a>
            <Link href="/iletisim"><MapPin size={15} />{settings.addressLine}</Link>
          </address>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Dinamik Mesleki ve Teknik Anadolu Lisesi</span>
          <div className="footer-legal-links">
            <Link href="/kvkk">KVKK Aydınlatma ve Veri Güvenliği</Link>
            <span aria-hidden="true">•</span>
            <span>Samsun / Türkiye</span>
          </div>
        </div>
      </footer>
      <a
        className="floating-whatsapp"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp üzerinden iletişime geçin"
      >
        <MessageCircle size={25} aria-hidden="true" />
      </a>
    </>
  );
}

export function InnerPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="inner-shell">
      <a className="skip-link" href="#main-content">İçeriğe geç</a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
