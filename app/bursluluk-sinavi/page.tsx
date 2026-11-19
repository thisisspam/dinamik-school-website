import type { Metadata } from "next";
import Image from "next/image";
import { Bus, CalendarDays, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { ScholarshipApplicationForm } from "../components/ScholarshipApplicationForm";

export const metadata: Metadata = {
  title: "2027 Bursluluk Sınavı Başvurusu",
  description: "Dinamik Okulları Samsun 9–10 Ocak 2027 bursluluk sınavı için oturum ve ücretsiz servis seçeneğiyle çevrim içi başvuru.",
  alternates: { canonical: "/bursluluk-sinavi" },
  openGraph: {
    title: "Dinamik Okulları 2027 Bursluluk Sınavı",
    description: "9–10 Ocak 2027 tarihlerindeki bursluluk sınavı için başvurunuzu tamamlayın.",
    images: [{ url: "/images/bursluluk/bursluluk-sinavi-2027.png", width: 1122, height: 1402, alt: "Dinamik Okulları 2027 Bursluluk Sınavı afişi" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/bursluluk/bursluluk-sinavi-2027.png"] },
};

const schedule = [
  ["9 Ocak Cumartesi", "10.00", "1. Oturum"],
  ["9 Ocak Cumartesi", "14.00", "2. Oturum"],
  ["10 Ocak Pazar", "10.00", "3. Oturum"],
  ["10 Ocak Pazar", "14.00", "4. Oturum"],
] as const;

export default function ScholarshipExamPage() {
  return (
    <InnerPageShell>
      <section className="scholarship-landing-hero" aria-labelledby="scholarship-page-title">
        <div className="container scholarship-landing-hero-grid">
          <div className="scholarship-landing-copy">
            <p className="scholarship-kicker">2026–2027 Akademik Yılı</p>
            <h1 id="scholarship-page-title">Bursluluk sınavı başvuruları başladı.</h1>
            <p className="scholarship-landing-lead">Dört oturumdan size uygun olanı seçin, başvurunuzu çevrim içi tamamlayın. Servis kullanacak öğrenciler sınava mevcut okullarının bahçesinden ücretsiz ulaşabilir.</p>
            <div className="scholarship-landing-points">
              <span><CalendarDays size={20} aria-hidden="true" /><strong>9–10 Ocak 2027</strong><small>Cumartesi ve Pazar</small></span>
              <span><Clock3 size={20} aria-hidden="true" /><strong>10.00 / 14.00</strong><small>Sabah ve öğle oturumları</small></span>
              <span><Bus size={20} aria-hidden="true" /><strong>Ücretsiz servis</strong><small>Mevcut okulunuzdan hareket</small></span>
            </div>
          </div>
          <div className="scholarship-landing-poster">
            <Image src="/images/bursluluk/bursluluk-sinavi-2027.png" alt="Dinamik Okulları Bursluluk Sınavı, 9–10 Ocak 2027; sabah oturumu 10.00, öğle oturumu 14.00" width={1122} height={1402} priority sizes="(max-width: 800px) 92vw, 430px" />
          </div>
        </div>
      </section>

      <section className="scholarship-application-section" id="basvuru" aria-labelledby="scholarship-form-section-title">
        <div className="container scholarship-application-grid">
          <div className="scholarship-application-info">
            <p className="scholarship-kicker">Oturumunuzu seçin</p>
            <h2 id="scholarship-form-section-title">Başvurunuzu tamamlayın.</h2>
            <p>Formu gönderdikten sonra başvurunuz okul kayıt sistemine alınır ve ilgili ekibe e-posta ile bildirilir.</p>
            <div className="scholarship-schedule">
              {schedule.map(([date, time, label]) => (
                <div key={label}><span>{label}</span><strong>{date}</strong><time>{time}</time></div>
              ))}
            </div>
            <div className="scholarship-service-note">
              <Bus size={22} aria-hidden="true" />
              <div><strong>Ücretsiz servis imkânı</strong><p>Servis kullanacak öğrenciler, mevcut okullarının bahçesinden kalkacak servislerle sınavımıza ücretsiz katılabilir.</p></div>
            </div>
            <ul className="scholarship-trust-list">
              <li><CheckCircle2 size={17} aria-hidden="true" /> Yalnızca gerekli başvuru bilgileri alınır.</li>
              <li><ShieldCheck size={17} aria-hidden="true" /> Bilgileriniz KVKK aydınlatma metnine uygun işlenir.</li>
            </ul>
          </div>
          <ScholarshipApplicationForm />
        </div>
      </section>
    </InnerPageShell>
  );
}
