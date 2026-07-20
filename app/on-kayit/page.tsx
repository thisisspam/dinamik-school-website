import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { RegistrationForm } from "../components/RegistrationForm";

export const metadata: Metadata = {
  title: "Ön Kayıt",
  description: "Dinamik Samsun bölümleri, kampüs ziyareti ve kayıt süreci için WhatsApp üzerinden ön kayıt bilgi talebi.",
  alternates: { canonical: "/on-kayit" },
};

export default function RegistrationPage() {
  return (
    <InnerPageShell>
      <PageHero eyebrow="Geleceğin için ilk adım" title="Seni tanıyalım, doğru programı birlikte keşfedelim." description="Kısa bilgi talebini ilet; bölümler, kampüs ve kayıt süreci hakkında okul ekibimizden destek al." image="/images/hero-banner.png" current="Ön Kayıt" compact />
      <section className="inner-section inner-section--soft">
        <div className="container registration-page-panel">
          <div className="registration-page-copy">
            <p className="inner-eyebrow">Ön kayıt bilgi talebi</p>
            <h2>Dinamik bir geleceğe hazır mısın?</h2>
            <p>Başvurunuz okulun güvenli yönetim paneline kaydedilir. İsteğe bağlı tercihinizle WhatsApp&apos;ta hazır bir mesaj da oluşturulur; göndermeden önce içeriği siz kontrol edersiniz.</p>
            <ul>
              <li><CheckCircle2 size={18} />Üç aktif mesleki alan hakkında bilgi</li>
              <li><CheckCircle2 size={18} />Kampüs ve atölye ziyareti planlama</li>
              <li><CheckCircle2 size={18} />Kayıt süreci ve koşulları</li>
              <li><ShieldCheck size={18} />Şeffaf ve kullanıcı kontrollü gönderim</li>
            </ul>
          </div>
          <RegistrationForm />
        </div>
      </section>
    </InnerPageShell>
  );
}
