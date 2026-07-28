import type { Metadata } from "next";
import {
  ExternalLink,
  FileCheck2,
  Mail,
  MapPin,
} from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { getSiteSettings } from "@/lib/content";
import { DATA_CONTROLLER_NAME, PRIVACY_NOTICE_VERSION } from "@/lib/privacy";
import { getContentPage } from "@/lib/cms/content";

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
  const [settings, page] = await Promise.all([getSiteSettings(), getContentPage("kvkk")]);
  const content = page.content;

  return (
    <InnerPageShell theme={page.theme}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image={content.heroImage}
        imageAlt={content.heroImageAlt}
        current="KVKK"
        size="slim"
      />

      <section className="inner-section inner-section--soft privacy-section" id="aydinlatma">
        <div className="container privacy-document-wrap">
          <article className="privacy-document" aria-labelledby="privacy-document-title">
            <header className="privacy-document-header">
              <p className="inner-eyebrow">{content.noticeEyebrow}</p>
              <h2 id="privacy-document-title">{content.noticeTitle}</h2>
              <div className="privacy-document-version" role="note" aria-label={`Aydınlatma metni sürümü ${PRIVACY_NOTICE_VERSION}`}>
                <FileCheck2 aria-hidden="true" size={18} />
                <span>Yürürlük tarihi: 17 Temmuz 2026 · Sürüm {PRIVACY_NOTICE_VERSION}</span>
              </div>
            </header>

            <div className="privacy-document-body">
              <section className="privacy-document-section" id="veri-sorumlusu">
                <h3>1. Veri sorumlusu</h3>
                <p><strong>{DATA_CONTROLLER_NAME}</strong>, ön kayıt formu aracılığıyla elde edilen kişisel veriler bakımından veri sorumlusu sıfatıyla hareket eder.</p>
                <dl className="privacy-document-contact">
                  <div>
                    <dt><Mail aria-hidden="true" size={16} /> E-posta</dt>
                    <dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd>
                  </div>
                  <div>
                    <dt><MapPin aria-hidden="true" size={16} /> Adres</dt>
                    <dd>{settings.addressLine}</dd>
                  </div>
                </dl>
              </section>

              <section className="privacy-document-section" id="islenen-veriler">
                <h3>2. İşlenen kişisel veriler</h3>
                <p>Ön kayıt başvurusunun alınması ve değerlendirilmesi için aşağıdaki bilgiler işlenebilir:</p>
                <ul>
                  <li>Öğrenci ve veli adı soyadı</li>
                  <li>Telefon numarası ve mevcut sınıf</li>
                  <li>İlgilenilen eğitim alanı</li>
                  <li>Başvuru kaynağı, tarihi ve iletişim süreci notları</li>
                  <li>Aydınlatma metni sürümü ve tercih kayıtları</li>
                </ul>
              </section>

              <section className="privacy-document-section">
                <h3>3. Kişisel verilerin işlenme amaçları</h3>
                <p>Kişisel veriler aşağıdaki amaçlarla, amaçla bağlantılı, sınırlı ve ölçülü şekilde işlenir:</p>
                <ul>
                  <li>Ön kayıt ve bilgi talebinizi değerlendirmek</li>
                  <li>Veli veya öğrenciyle iletişime geçmek</li>
                  <li>Bölüm, kampüs ziyareti ve kayıt süreci hakkında bilgi vermek</li>
                  <li>Başvurunun sonucunu ve iletişim geçmişini takip etmek</li>
                  <li>Hukuki yükümlülükleri yerine getirmek ve hakları korumak</li>
                </ul>
              </section>

              <section className="privacy-document-section">
                <h3>4. Veri toplama yöntemi ve hukuki sebep</h3>
                <p>Veriler doğrudan sizden, ön kayıt formu aracılığıyla elektronik ortamda elde edilir. Başvurunun değerlendirilmesi; KVKK m.5/2 kapsamında bir sözleşmenin kurulmasıyla doğrudan ilgili olma, hukuki yükümlülüklerin yerine getirilmesi ve temel haklarınıza zarar vermemek kaydıyla meşru menfaat hukuki sebeplerine dayanır. Ayrı bir tercihe bağlı işlemler gerektiğinde açık rızanız esas alınır.</p>
              </section>

              <section className="privacy-document-section" id="aktarim">
                <h3>5. Kişisel verilerin aktarılması</h3>
                <p>Veriler; görevleriyle sınırlı okul yöneticileri ve kayıt birimi, güvenli barındırma hizmeti sağlayıcıları ile kanunen yetkili kamu kurumlarıyla, yalnızca gerekli olduğu ölçüde paylaşılabilir.</p>
                <p className="privacy-document-note"><strong>WhatsApp tercihi:</strong> Formdaki ayrı ve isteğe bağlı seçeneği işaretlerseniz, bilgileriniz hazır mesajın açılması için WhatsApp/Meta hizmetine aktarılabilir ve bu hizmet kapsamında yurt dışı aktarım gündeme gelebilir. Mesajı gönderdiğinizde bilgiler ayrıca okulun WhatsApp hattına iletilir. Bu tercihi vermeden de başvurunuzu tamamlayabilirsiniz.</p>
              </section>

              <section className="privacy-document-section">
                <h3>6. Saklama süresi ve imha</h3>
                <p>Başvuru kayıtları, talebin ve kayıt iletişiminin sonuçlandırılması için gereken süre boyunca saklanır; işleme amacı ve varsa kanuni saklama zorunluluğu sona erdiğinde periyodik kontrollerle silinir, yok edilir veya anonim hâle getirilir. Haklı silme talepleri ayrıca değerlendirilir.</p>
              </section>

              <section className="privacy-document-section" id="haklariniz">
                <p className="privacy-document-label">{content.rightsEyebrow}</p>
                <h3>7. {content.rightsTitle}</h3>
                <p>{content.rightsDescription}</p>
                <ul className="privacy-document-rights">
                  {rights.map((right) => <li key={right}>{right}</li>)}
                </ul>
                <div className="privacy-document-application">
                  <h4>Başvuru kanalları</h4>
                  <p>Haklarınıza ilişkin taleplerinizi aşağıdaki kanallardan veri sorumlusuna iletebilirsiniz:</p>
                  <dl className="privacy-document-contact">
                    <div>
                      <dt><Mail aria-hidden="true" size={16} /> E-posta ile başvuru</dt>
                      <dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd>
                    </div>
                    <div>
                      <dt><MapPin aria-hidden="true" size={16} /> Yazılı başvuru adresi</dt>
                      <dd>{settings.addressLine}</dd>
                    </div>
                  </dl>
                </div>
              </section>

              <section className="privacy-document-section" id="veri-guvenligi">
                <p className="privacy-document-label">{content.securityEyebrow}</p>
                <h3>8. {content.securityTitle}</h3>
                <p>{content.securityDescription}</p>
                <ul className="privacy-document-security">
                  <li><strong>Yetkili erişim:</strong> Başvurular yalnızca oturum doğrulaması yapılan yönetim panelinde, görevli kullanıcılar tarafından görüntülenir.</li>
                  <li><strong>Veri minimizasyonu:</strong> Ön kayıt için zorunlu olmayan özel nitelikli kişisel veriler istenmez; tercihler ayrıca kaydedilir.</li>
                  <li><strong>Saklama kontrolü:</strong> Yönetim paneli, amacı sona eren veya ilgili kişi talebine konu olan başvuruların kalıcı olarak silinmesine imkân verir.</li>
                  <li><strong>Güvenli işletim:</strong> Canlı ortamda HTTPS, güçlü yönetici bilgileri, güvenli oturum anahtarı, düzenli yedekleme ve erişim denetimleri uygulanmalıdır.</li>
                </ul>
              </section>

              <footer className="privacy-document-sources">
                <h3>Resmî kaynaklar</h3>
                <a href="https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-" target="_blank" rel="noreferrer">
                  KVKK Kurumu aydınlatma rehberi <ExternalLink aria-hidden="true" size={15} />
                </a>
                <a href="https://www.kvkk.gov.tr/Icerik/2040/Veri-Guvenligine-Iliskin-Yukumlulukler" target="_blank" rel="noreferrer">
                  KVKK Kurumu veri güvenliği yükümlülükleri <ExternalLink aria-hidden="true" size={15} />
                </a>
              </footer>
            </div>
          </article>
        </div>
      </section>
    </InnerPageShell>
  );
}
