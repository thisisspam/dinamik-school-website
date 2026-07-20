import type { Metadata } from "next";
import {
  CheckCircle2,
  Database,
  ExternalLink,
  FileCheck2,
  LockKeyhole,
  Mail,
  MapPin,
  Scale,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { getSiteSettings } from "@/lib/content";
import { DATA_CONTROLLER_NAME, PRIVACY_NOTICE_VERSION } from "@/lib/privacy";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma ve Veri Güvenliği",
  description: "Dinamik Samsun ön kayıt sürecinde kişisel verilerin işlenmesi, aktarılması, korunması ve ilgili kişi hakları.",
  alternates: { canonical: "/kvkk" },
};

const rights = [
  "Kişisel verilerinizin işlenip işlenmediğini öğrenme ve bilgi talep etme",
  "İşleme amacını ve verilerin amacına uygun kullanılıp kullanılmadığını öğrenme",
  "Verilerin aktarıldığı yurt içindeki veya yurt dışındaki üçüncü kişileri bilme",
  "Eksik veya yanlış işlenen verilerin düzeltilmesini isteme",
  "Kanuni şartlar oluştuğunda verilerin silinmesini veya yok edilmesini isteme",
  "Düzeltme ve silme işlemlerinin verilerin aktarıldığı kişilere bildirilmesini isteme",
  "Münhasıran otomatik sistemlerle oluşan aleyhe sonuca itiraz etme ve zararın giderilmesini talep etme",
];

export default async function KvkkPage() {
  const settings = await getSiteSettings();

  return (
    <InnerPageShell>
      <PageHero
        eyebrow="KVKK ve veri güvenliği"
        title="Verileriniz üzerinde söz sizde."
        description="Ön kayıt talebiniz sırasında hangi bilgileri, neden ve ne kadar süreyle işlediğimizi açık ve anlaşılır biçimde öğrenin."
        image="/images/about-school-campus.png"
        current="KVKK"
        compact
      />

      <section className="inner-section inner-section--soft privacy-section" id="aydinlatma">
        <div className="container">
          <div className="privacy-heading">
            <div>
              <p className="inner-eyebrow">Ön kayıt aydınlatma metni</p>
              <h2>Bilgilerinizin yolculuğu şeffaf olsun.</h2>
            </div>
            <div className="privacy-version" aria-label={`Aydınlatma metni sürümü ${PRIVACY_NOTICE_VERSION}`}>
              <FileCheck2 aria-hidden="true" size={20} />
              <span><small>Yürürlük tarihi</small><strong>17 Temmuz 2026 · Sürüm {PRIVACY_NOTICE_VERSION}</strong></span>
            </div>
          </div>

          <nav className="privacy-jump-links" aria-label="KVKK sayfa içi bağlantıları">
            <a href="#veri-sorumlusu">Veri sorumlusu</a>
            <a href="#islenen-veriler">İşlenen veriler</a>
            <a href="#aktarim">Aktarım</a>
            <a href="#haklariniz">Haklarınız</a>
            <a href="#veri-guvenligi">Veri güvenliği</a>
          </nav>

          <div className="privacy-grid">
            <article className="privacy-card privacy-card--featured" id="veri-sorumlusu">
              <span className="privacy-card-icon"><ShieldCheck aria-hidden="true" size={22} /></span>
              <div>
                <p className="privacy-card-kicker">01 · Veri sorumlusu</p>
                <h3>{DATA_CONTROLLER_NAME}</h3>
                <p>Ön kayıt formu aracılığıyla elde edilen kişisel veriler bakımından veri sorumlusu sıfatıyla hareket eder.</p>
                <div className="privacy-contact-strip">
                  <a href={`mailto:${settings.email}`}><Mail aria-hidden="true" size={16} />{settings.email}</a>
                  <span><MapPin aria-hidden="true" size={16} />{settings.addressLine}</span>
                </div>
              </div>
            </article>

            <article className="privacy-card" id="islenen-veriler">
              <span className="privacy-card-icon"><Database aria-hidden="true" size={22} /></span>
              <p className="privacy-card-kicker">02 · Hangi veriler?</p>
              <h3>Yalnızca başvuru için gerekli bilgiler</h3>
              <ul>
                <li>Öğrenci ve veli adı soyadı</li>
                <li>Telefon numarası ve mevcut sınıf</li>
                <li>İlgilenilen eğitim alanı</li>
                <li>Başvuru kaynağı, tarihi ve iletişim süreci notları</li>
                <li>Aydınlatma metni sürümü ve tercih kayıtları</li>
              </ul>
            </article>

            <article className="privacy-card">
              <span className="privacy-card-icon"><UserRoundCheck aria-hidden="true" size={22} /></span>
              <p className="privacy-card-kicker">03 · İşleme amaçları</p>
              <h3>Talebinizi yanıtlamak ve süreci yönetmek</h3>
              <ul>
                <li>Ön kayıt ve bilgi talebinizi değerlendirmek</li>
                <li>Veli veya öğrenciyle iletişime geçmek</li>
                <li>Bölüm, kampüs ziyareti ve kayıt süreci hakkında bilgi vermek</li>
                <li>Başvurunun sonucunu ve iletişim geçmişini takip etmek</li>
                <li>Hukuki yükümlülükleri yerine getirmek ve hakları korumak</li>
              </ul>
            </article>

            <article className="privacy-card">
              <span className="privacy-card-icon"><Scale aria-hidden="true" size={22} /></span>
              <p className="privacy-card-kicker">04 · Yöntem ve hukuki sebep</p>
              <h3>Elektronik form üzerinden, sınırlı ve ölçülü</h3>
              <p>Veriler doğrudan sizden, ön kayıt formu aracılığıyla elektronik ortamda elde edilir. Başvurunun değerlendirilmesi; KVKK m.5/2 kapsamında bir sözleşmenin kurulmasıyla doğrudan ilgili olma, hukuki yükümlülüklerin yerine getirilmesi ve temel haklarınıza zarar vermemek kaydıyla meşru menfaat hukuki sebeplerine dayanır. Ayrı bir tercihe bağlı işlemler gerektiğinde açık rızanız esas alınır.</p>
            </article>

            <article className="privacy-card" id="aktarim">
              <span className="privacy-card-icon"><ExternalLink aria-hidden="true" size={22} /></span>
              <p className="privacy-card-kicker">05 · Kimlere aktarılabilir?</p>
              <h3>Yetkili kişiler ve zorunlu hizmet sağlayıcılar</h3>
              <p>Veriler; görevleriyle sınırlı okul yöneticileri ve kayıt birimi, güvenli barındırma hizmeti sağlayıcıları ile kanunen yetkili kamu kurumlarıyla, yalnızca gerekli olduğu ölçüde paylaşılabilir.</p>
              <p className="privacy-card-note"><strong>WhatsApp tercihi:</strong> Formdaki ayrı ve isteğe bağlı seçeneği işaretlerseniz, bilgileriniz hazır mesajın açılması için WhatsApp/Meta hizmetine aktarılabilir ve bu hizmet kapsamında yurt dışı aktarım gündeme gelebilir. Mesajı gönderdiğinizde bilgiler ayrıca okulun WhatsApp hattına iletilir. Bu tercihi vermeden de başvurunuzu tamamlayabilirsiniz.</p>
            </article>

            <article className="privacy-card">
              <span className="privacy-card-icon"><LockKeyhole aria-hidden="true" size={22} /></span>
              <p className="privacy-card-kicker">06 · Saklama ve imha</p>
              <h3>Amacın gerektirdiğinden uzun değil</h3>
              <p>Başvuru kayıtları, talebin ve kayıt iletişiminin sonuçlandırılması için gereken süre boyunca saklanır; işleme amacı ve varsa kanuni saklama zorunluluğu sona erdiğinde periyodik kontrollerle silinir, yok edilir veya anonim hâle getirilir. Haklı silme talepleri ayrıca değerlendirilir.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="inner-section privacy-rights-section" id="haklariniz">
        <div className="container privacy-rights-grid">
          <div className="privacy-rights-copy">
            <p className="inner-eyebrow">KVKK Madde 11</p>
            <h2>Haklarınızı kullanmak çok kolay.</h2>
            <p>Kimliğinizi doğrulamaya elverişli bilgiler ve talebinizin açık açıklamasıyla okulumuza başvurabilirsiniz. Başvurular, niteliğine göre mümkün olan en kısa sürede ve kanuni süre içinde yanıtlanır.</p>
            <div className="privacy-application-box">
              <a href={`mailto:${settings.email}`}><Mail aria-hidden="true" size={17} /><span><small>E-posta ile başvuru</small><strong>{settings.email}</strong></span></a>
              <div><MapPin aria-hidden="true" size={17} /><span><small>Yazılı başvuru adresi</small><strong>{settings.addressLine}</strong></span></div>
            </div>
            <a className="privacy-official-link" href="https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-" target="_blank" rel="noreferrer">
              KVKK Kurumu aydınlatma rehberini inceleyin <ExternalLink aria-hidden="true" size={15} />
            </a>
          </div>
          <ul className="privacy-rights-list">
            {rights.map((right) => <li key={right}><CheckCircle2 aria-hidden="true" size={18} /><span>{right}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="inner-section inner-section--navy privacy-security-section" id="veri-guvenligi">
        <div className="container">
          <div className="inner-section-header">
            <div><p className="inner-eyebrow">Veri güvenliği</p><h2>Koruma, tasarımın ilk adımıdır.</h2></div>
            <p>KVKK&apos;nın hukuka aykırı işleme ve erişimi önleme, verilerin muhafazasını sağlama yükümlülükleri doğrultusunda teknik ve idari kontroller birlikte ele alınır.</p>
          </div>
          <div className="privacy-security-grid">
            <article><LockKeyhole aria-hidden="true" size={23} /><h3>Yetkili erişim</h3><p>Başvurular yalnızca oturum doğrulaması yapılan yönetim panelinde, görevli kullanıcılar tarafından görüntülenir.</p></article>
            <article><Database aria-hidden="true" size={23} /><h3>Veri minimizasyonu</h3><p>Ön kayıt için zorunlu olmayan özel nitelikli kişisel veriler istenmez; tercihler ayrıca kaydedilir.</p></article>
            <article><FileCheck2 aria-hidden="true" size={23} /><h3>Saklama kontrolü</h3><p>Yönetim paneli, amacı sona eren veya ilgili kişi talebine konu olan başvuruların kalıcı olarak silinmesine imkân verir.</p></article>
            <article><ShieldCheck aria-hidden="true" size={23} /><h3>Güvenli işletim</h3><p>Canlı ortamda HTTPS, güçlü yönetici bilgileri, güvenli oturum anahtarı, düzenli yedekleme ve erişim denetimleri uygulanmalıdır.</p></article>
          </div>
          <a className="privacy-security-source" href="https://www.kvkk.gov.tr/Icerik/2040/Veri-Guvenligine-Iliskin-Yukumlulukler" target="_blank" rel="noreferrer">
            KVKK Kurumu veri güvenliği yükümlülükleri <ExternalLink aria-hidden="true" size={15} />
          </a>
        </div>
      </section>
    </InnerPageShell>
  );
}
