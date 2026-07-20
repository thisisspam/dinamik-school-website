import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader, SiteFooter } from "./components/SiteChrome";

export default function NotFound() {
  return (
    <div className="inner-shell">
      <SiteHeader />
      <main className="not-found">
        <div><strong aria-hidden="true">404</strong><h1>Aradığınız sayfa burada değil.</h1><p>Bağlantı değişmiş olabilir. Ana sayfaya dönerek tüm bölümlere ve okul içeriklerine ulaşabilirsiniz.</p><Link className="button button--primary" href="/"><ArrowLeft size={16} />Ana sayfaya dön</Link></div>
      </main>
      <SiteFooter />
    </div>
  );
}
