import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone, Play } from "lucide-react";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import type { NavigationItem } from "./navigation";
import { ScrollAwareHeader } from "./ScrollAwareHeader";
import { getSiteSettings } from "../../lib/content";
import { createWhatsappHref } from "../../lib/whatsapp";
import { getContentPage } from "@/lib/cms/content";
import { contentPageThemeClass } from "@/lib/cms/content";
import type { ContentPageTheme } from "@/lib/cms/types";
import { parseContentRows, safeContentHref } from "@/lib/cms/helpers";

function parseNavigation(value: string): NavigationItem[] {
  const navigation: NavigationItem[] = [];
  for (const rawLine of value.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const isChild = line.startsWith("-");
    const [label, href] = line.replace(/^-+\s*/, "").split("|").map((item) => item.trim());
    if (!label || !href) continue;
    if (isChild && navigation.length > 0) {
      const parent = navigation[navigation.length - 1];
      parent.children = [...(parent.children ?? []), { label, href: safeContentHref(href, "/") }];
    } else {
      navigation.push({ label, href: safeContentHref(href, "/") });
    }
  }
  return navigation;
}

export async function SiteHeader() {
  const chrome = await getContentPage("site-chrome");
  const siteNavigation = parseNavigation(chrome.content.navigation);
  const primaryHref = safeContentHref(chrome.content.headerPrimaryHref, "/on-kayit");
  const secondaryHref = safeContentHref(chrome.content.headerSecondaryHref, "https://e-okul.meb.gov.tr/");
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
          <Link className="button button--header" href={primaryHref}>
            {chrome.content.headerPrimaryLabel}
          </Link>
          <a
            className="button button--ghost-dark"
            href={secondaryHref}
            target="_blank"
            rel="noreferrer"
          >
            {chrome.content.headerSecondaryLabel} <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
        <MobileNavigation navigation={siteNavigation} ctaHref={primaryHref} ctaLabel={chrome.content.headerPrimaryLabel} />
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
  const [settings, chrome] = await Promise.all([getSiteSettings(), getContentPage("site-chrome")]);
  const generalPhoneTel = `tel:+9${settings.generalPhone.replace(/\D/g, "")}`;
  const landlineTel = `tel:+9${settings.landlinePhone.replace(/\D/g, "")}`;
  const whatsappHref = createWhatsappHref(settings.whatsapp);
  const firstLinks = parseContentRows(chrome.content.footerFirstLinks, 2);
  const secondLinks = parseContentRows(chrome.content.footerSecondLinks, 2);

  return (
    <>
      <footer className="site-footer inner-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <Link className="brand brand--footer" href="/" aria-label="Dinamik Okulları anasayfa">
              <Image src="/images/footer-logo-dinamik.png" alt="Dinamik Okulları" width={125} height={35} unoptimized />
            </Link>
            <p>{chrome.content.footerTagline}</p>
            <div className="inner-footer-social">
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
              {settings.youtubeUrl ? <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" aria-label="YouTube"><Play size={18} /></a> : null}
            </div>
          </div>
          <div className="footer-links">
            <strong>{chrome.content.footerFirstTitle}</strong>
            {firstLinks.map(([label, href]) => <Link href={safeContentHref(href, "/")} key={`${label}-${href}`}>{label}</Link>)}
          </div>
          <div className="footer-links">
            <strong>{chrome.content.footerSecondTitle}</strong>
            {secondLinks.map(([label, href]) => <Link href={safeContentHref(href, "/")} key={`${label}-${href}`}>{label}</Link>)}
          </div>
          <address className="inner-footer-contact">
            <strong>{chrome.content.footerContactTitle}</strong>
            <a href={generalPhoneTel}><Phone size={15} />{settings.generalPhone}</a>
            <a href={landlineTel}><Phone size={15} />{settings.landlinePhone}</a>
            <a href={`mailto:${settings.email}`}><Mail size={15} />{settings.email}</a>
            <Link href="/iletisim"><MapPin size={15} />{settings.addressLine}</Link>
          </address>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} {chrome.content.copyrightText}</span>
          <div className="footer-legal-links">
            <Link href="/kvkk">{chrome.content.footerLegalLabel}</Link>
            <span aria-hidden="true">•</span>
            <span>{chrome.content.footerLocation}</span>
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

export function InnerPageShell({
  children,
  theme = "original",
}: {
  children: React.ReactNode;
  theme?: ContentPageTheme;
}) {
  return (
    <div className={`inner-shell${contentPageThemeClass(theme)}`}>
      <a className="skip-link" href="#main-content">İçeriğe geç</a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
