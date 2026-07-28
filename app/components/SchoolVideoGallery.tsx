import { Film, PlayCircle, Volume2 } from "lucide-react";
import { parseContentRows } from "@/lib/cms/helpers";

export function SchoolVideoGallery({ content }: { content: Record<string, string> }) {
  const supportingVideos = parseContentRows(content.supportingVideos, 5).map(
    ([category, title, description, src, duration]) => ({ category, title, description, src, duration }),
  );
  return (
    <section
      className="inner-section school-video-showcase"
      aria-labelledby="school-video-title"
    >
      <div className="container">
        <div className="inner-section-header">
          <div>
            <p className="inner-eyebrow">{content.videoEyebrow}</p>
            <h2 id="school-video-title">{content.videoTitle}</h2>
          </div>
          <p>
            {content.videoDescription}
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
              <source src={content.featureVideo} type="video/mp4" />
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
            <span className="school-video-playing-badge">
              <span aria-hidden="true" /> Otomatik oynatılıyor
            </span>
          </div>

          <div className="school-video-feature-copy">
            <p className="school-video-kicker"><Film size={17} aria-hidden="true" /> Ana tanıtım filmi</p>
            <h3>{content.featureVideoTitle}</h3>
            <p>{content.featureVideoDescription}</p>
            <div className="school-video-details">
              <span><PlayCircle size={18} aria-hidden="true" /> 1 dakika 30 saniye</span>
              <span><Volume2 size={18} aria-hidden="true" /> Sesi oynatıcıdan açabilirsiniz</span>
            </div>
            <time>{content.featureVideoDuration}</time>
          </div>
        </article>

        <div className="school-video-collection-heading">
          <div>
            <span>Video galeri</span>
            <h3>Okul yaşamından daha fazla görüntü</h3>
          </div>
          <p>Diğer videoları oynatmak için görüntünün üzerine dokunun.</p>
        </div>

        <div className="school-video-grid" role="group" aria-label="Diğer okul videoları">
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
                <time>{video.duration}</time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
