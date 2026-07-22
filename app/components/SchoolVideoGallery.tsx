import { Film, PlayCircle, Volume2 } from "lucide-react";

const supportingVideos = [
  {
    src: "/uploads/videos/okulumuzdan-goruntuler-1.mp4",
    category: "Kimya Teknolojileri",
    title: "Kimyada analiz ve kalite kontrol",
    description:
      "Kimya Laboratuvarı Dalındaki uygulamalı analiz ve kalite kontrol süreçlerini tanıyın.",
    duration: "1:26",
    dateTime: "PT1M26S",
  },
  {
    src: "/uploads/videos/okulumuzdan-goruntuler-2.mp4",
    category: "Elektrik - Elektronik",
    title: "Elektrik - Elektronik atölyelerinde eğitim",
    description:
      "Elektrik Tesisatları ve Dağıtımı Dalındaki uygulamalı çalışmaları yakından görün.",
    duration: "1:51",
    dateTime: "PT1M51S",
  },
  {
    src: "/uploads/videos/okulumuzdan-goruntuler-3.mp4",
    category: "Öğrenci deneyimi",
    title: "Dinamik'te öğrenci olmak",
    description:
      "Öğrencilerimizin Dinamik'teki eğitim ve okul yaşamı deneyimlerini kendi sözlerinden dinleyin.",
    duration: "0:52",
    dateTime: "PT52S",
  },
  {
    src: "/uploads/videos/okulumuzdan-goruntuler-4.mp4",
    category: "Biyomedikal Cihaz",
    title: "Biyomedikal Cihaz Teknolojileri",
    description:
      "Tıbbi Görüntüleme Sistemleri Dalındaki uygulamalı eğitim yaklaşımımızı keşfedin.",
    duration: "0:45",
    dateTime: "PT45S",
  },
];

export function SchoolVideoGallery() {
  return (
    <section
      className="inner-section school-video-showcase"
      aria-labelledby="school-video-title"
    >
      <div className="container">
        <div className="inner-section-header">
          <div>
            <p className="inner-eyebrow">Okulumuzu tanıyın</p>
            <h2 id="school-video-title">Dinamik&apos;te eğitimi ve okul yaşamını yakından görün.</h2>
          </div>
          <p>
            Kampüsümüzü, uygulamalı eğitim ortamlarımızı ve okul yaşamından kesitleri
            videolarımızla keşfedin.
          </p>
        </div>

        <article className="school-video-feature" id="okulumuzu-taniyin">
          <div className="school-video-feature-player">
            <video
              aria-label="Okulumuzu Tanıyın ana tanıtım videosu"
              autoPlay
              controls
              muted
              playsInline
              preload="metadata"
            >
              <source src="/uploads/videos/okulumuzu-taniyin.mp4" type="video/mp4" />
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
            <span className="school-video-playing-badge">
              <span aria-hidden="true" /> Otomatik oynatılıyor
            </span>
          </div>

          <div className="school-video-feature-copy">
            <p className="school-video-kicker"><Film size={17} aria-hidden="true" /> Ana tanıtım filmi</p>
            <h3>Okulumuzu 90 saniyede keşfedin.</h3>
            <p>
              Dinamik&apos;in eğitim ortamlarını, kampüs atmosferini ve öğrencilerimize
              sunduğu uygulamalı öğrenme deneyimini tek videoda izleyin.
            </p>
            <div className="school-video-details">
              <span><PlayCircle size={18} aria-hidden="true" /> 1 dakika 30 saniye</span>
              <span><Volume2 size={18} aria-hidden="true" /> Sesi oynatıcıdan açabilirsiniz</span>
            </div>
            <time dateTime="PT1M30S">01:30</time>
          </div>
        </article>

        <div className="school-video-collection-heading">
          <div>
            <span>Video galeri</span>
            <h3>Okul yaşamından daha fazla görüntü</h3>
          </div>
          <p>Diğer videoları oynatmak için görüntünün üzerine dokunun.</p>
        </div>

        <div className="school-video-grid" aria-label="Diğer okul videoları">
          {supportingVideos.map((video) => (
            <article className="school-video-card" key={video.src}>
              <video
                aria-label={video.title}
                controls
                playsInline
                preload="metadata"
              >
                <source src={video.src} type="video/mp4" />
                Tarayıcınız video oynatmayı desteklemiyor.
              </video>
              <div className="school-video-card-copy">
                <div>
                  <span>{video.category}</span>
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
                <time dateTime={video.dateTime}>{video.duration}</time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
