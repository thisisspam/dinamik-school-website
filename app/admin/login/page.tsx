import "../admin.css";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, UserRound } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";

export const metadata = { title: "Giriş — Dinamik Yönetim Paneli" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="admin-login-shell">
      <section className="admin-login-story" aria-label="Dinamik Okulları yönetim paneli">
        <div className="admin-login-grid" aria-hidden="true" />
        <div className="admin-login-story-content">
          <span className="admin-login-logo">
            <Image src="/images/dinamik-logo-retina.png" alt="Dinamik Okulları" width={170} height={77} priority />
          </span>
          <span className="admin-login-kicker">Samsun Kampüsü</span>
          <h2>İçerikleriniz,<br />tek bir merkezde.</h2>
          <p>Bölümleri, kadroyu, galeriyi ve iletişim bilgilerini güvenle yönetin.</p>
          <div className="admin-login-proof">
            <CheckCircle2 aria-hidden="true" size={19} />
            <span><strong>Güvenli yönetim</strong><small>Yetkilendirilmiş oturum erişimi</small></span>
          </div>
        </div>
      </section>
      <section className="admin-login-panel">
        <div className="admin-login-card">
          <div className="admin-login-lock"><LockKeyhole aria-hidden="true" size={22} /></div>
          <span className="admin-eyebrow">Yönetim Paneli</span>
          <h1>Tekrar hoş geldiniz</h1>
          <p>Devam etmek için yönetici hesabınızla giriş yapın.</p>
          {error ? <div className="admin-error" role="alert">Kullanıcı adı veya şifre hatalı. Lütfen tekrar deneyin.</div> : null}
          <form action={loginAction}>
            <label>
              <span>Kullanıcı adı</span>
              <span className="admin-input-wrap">
                <UserRound aria-hidden="true" size={18} />
                <input type="text" name="username" autoComplete="username" placeholder="Kullanıcı adınız" required autoFocus />
              </span>
            </label>
            <label>
              <span>Şifre</span>
              <span className="admin-input-wrap">
                <LockKeyhole aria-hidden="true" size={18} />
                <input type="password" name="password" autoComplete="current-password" placeholder="Şifreniz" required />
              </span>
            </label>
            <button type="submit">Giriş yap <ArrowRight aria-hidden="true" size={18} /></button>
          </form>
          <Link className="admin-back-link" href="/"><ArrowLeft aria-hidden="true" size={16} /> Siteye geri dön</Link>
        </div>
      </section>
      </div>
  );
}
