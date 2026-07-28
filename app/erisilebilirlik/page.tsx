import type { Metadata } from "next";
import { CheckCircle2, Keyboard, Mail, MonitorCog, PauseCircle, Phone, Subtitles } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "Erişilebilirlik",
  description:
    "Dinamik Mesleki ve Teknik Anadolu Lisesi Samsun internet sitesinin erişilebilirlik hedefi, mevcut özellikleri ve geri bildirim kanalları.",
  alternates: { canonical: "/erisilebilirlik" },
};

const accessibilityFeatures = [
  {
    icon: Keyboard,
    title: "Klavye ile kullanım",
    text: "Ana menüler, formlar ve fotoğraf galerileri klavyeyle kullanılabilir; sayfalarda ana içeriğe geçiş bağlantısı bulunur.",
  },
  {
    icon: MonitorCog,
    title: "Anlaşılır yapı",
    text: "Sayfa dili, başlık hiyerarşisi, bağlantı adları, form etiketleri ve ana içerik bölgeleri yardımcı teknolojilere uygun biçimde tanımlanır.",
  },
  {
    icon: PauseCircle,
    title: "Hareket denetimi",
    text: "Fotoğraf galerilerindeki otomatik geçiş durdurulabilir; işletim sistemindeki azaltılmış hareket tercihi desteklenir.",
  },
];

export default async function AccessibilityPage() {
  const settings = await getSiteSettings();
  const phoneHref = `tel:+9${settings.generalPhone.replace(/\D/g, "")}`;

  return (
    <InnerPageShell>
      <PageHero
        eyebrow="Erişilebilirlik"
        title="Herkes için kullanılabilir bir okul sitesi"
        description="Sitemizi farklı ihtiyaçlara sahip ziyaretçilerin bilgiye bağımsız ve eşit biçimde ulaşabileceği şekilde geliştirmeyi sürdürüyoruz."
        image="/images/about-school-campus.png"
        current="Erişilebilirlik"
        size="slim"
      />

      <section className="inner-section inner-section--soft" aria-labelledby="accessibility-status-title">
        <div className="container">
          <div className="inner-section-header">
            <div>
              <p className="inner-eyebrow">Uyum durumu</p>
              <h2 id="accessibility-status-title">WCAG 2.2 A seviyesi hedeflenmektedir</h2>
            </div>
            <p>
              Bu internet sitesi, 2025/10 sayılı Cumhurbaşkanlığı Genelgesi kapsamında yayımlanan
              Web Siteleri ve Mobil Uygulamaların Erişilebilirliği Kontrol Listesi dikkate alınarak
              incelenmektedir.
            </p>
          </div>

          <div className="feature-card-grid">
            {accessibilityFeatures.map(({ icon: Icon, title, text }) => (
              <article className="feature-card" key={title}>
                <span aria-hidden="true"><Icon size={23} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="inner-section" aria-labelledby="accessibility-limitations-title">
        <div className="container editorial-grid">
          <div className="editorial-copy">
            <p className="inner-eyebrow">Bilinen sınırlamalar</p>
            <h2 id="accessibility-limitations-title">İyileştirme çalışmaları devam ediyor</h2>
            <p>
              Okulumuz sayfasındaki tanıtım videolarında görüntüye gömülü Türkçe açık altyazılar
              bulunmaktadır. Bununla birlikte kullanıcı tarafından açılıp kapatılabilen ayrı altyazı
              izleri ve indirilebilir tam metin dökümleri henüz sunulmamaktadır.
            </p>
            <p>
              Sitede resmî erişilebilirlik logosu kullanılmamaktadır. Bu logo ancak yetkili Bakanlık
              incelemesi ve doğrulaması sonrasında kullanılacaktır.
            </p>
          </div>

          <div className="editorial-copy">
            <p className="inner-eyebrow">Geri bildirim</p>
            <h2>Erişim sorunu bildirimi</h2>
            <p>
              Bir içeriğe, forma veya işleve erişirken sorun yaşarsanız sayfayı ve yaşadığınız sorunu
              belirterek bize ulaşabilirsiniz. Bildirimler okul yönetimi ve site ekibi tarafından incelenir.
            </p>
            <ul className="check-list-grid">
              <li>
                <Mail aria-hidden="true" size={18} />
                <a href={`mailto:${settings.email}?subject=Web%20sitesi%20eri%C5%9Filebilirlik%20bildirimi`}>
                  {settings.email}
                </a>
              </li>
              <li>
                <Phone aria-hidden="true" size={18} />
                <a href={phoneHref}>{settings.generalPhone}</a>
              </li>
              <li>
                <Subtitles aria-hidden="true" size={18} />
                Video altyazısı ve içerik alternatifi talepleri
              </li>
              <li>
                <CheckCircle2 aria-hidden="true" size={18} />
                Son gözden geçirme: 27 Temmuz 2026
              </li>
            </ul>
          </div>
        </div>
      </section>
    </InnerPageShell>
  );
}
