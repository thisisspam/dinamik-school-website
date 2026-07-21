import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const nextBin = createRequire(import.meta.url).resolve("next/dist/bin/next");

let serverProcess;

async function waitForServer(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) return;
    } catch {
      // Server not ready yet — keep polling.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Server did not become ready on ${BASE_URL} within ${timeoutMs}ms`);
}

before(async () => {
  // Spawn the `next` binary directly (no shell/npx wrapper) so `.kill()` in
  // the `after` hook terminates the real process instead of an orphaned child.
  serverProcess = spawn(process.execPath, [nextBin, "start", "-p", String(PORT)], {
    cwd: new URL("..", import.meta.url),
    stdio: "pipe",
  });
  await waitForServer(30000);
});

after(() => {
  serverProcess?.kill();
});

async function render() {
  return fetch(BASE_URL);
}

async function readRoute(route) {
  const response = await fetch(`${BASE_URL}${route}`);
  assert.equal(response.status, 200, `${route} should respond with 200`);
  return response.text();
}

test("renders the completed Turkish school homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]+lang="tr"/i);
  assert.match(html, /<title>Dinamik Mesleki ve Teknik Anadolu Lisesi \| Samsun<\/title>/i);
  assert.match(html, /Geleceğin.*Teknolojisini.*Bugünden Öğren/s);
  assert.match(html, /Kimya Teknolojileri/);
  assert.match(html, /Elektrik-Elektronik Teknolojileri/);
  assert.match(html, /Biyomedikal Cihaz Teknolojileri/);
  assert.match(html, /Ön Kayıt Talebi/);
  assert.match(html, /Toybelen Mahallesi Anadolu Bulvarı No:225/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps essential navigation and accessibility contracts", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /href="#main-content"[^>]*>\s*İçeriğe geç/i);
  assert.match(html, /<main id="main-content">/i);
  assert.match(html, /aria-label="Ana navigasyon"/i);
  assert.match(html, /href="\/bolumler"[^>]*>\s*Bölümler/i);
  assert.match(html, /Bölümler[\s\S]*Kimya[\s\S]*Elektrik - Elektronik[\s\S]*Biyomedikal/i);
  assert.match(html, /href="\/okulumuz"[^>]*>\s*Okulumuz/i);
  assert.match(html, /Okulumuz[\s\S]*Hakkımızda[\s\S]*Okul Kıyafetlerimiz[\s\S]*Rehberlik/i);
  assert.match(
    html,
    /Galeri[\s\S]*Sosyal, Kültürel ve Sportif Çalışmalar/i,
  );
  assert.match(html, /href="\/galeri"[^>]*>\s*Galeri/i);
  assert.match(html, /href="\/kadromuz"/i);
  assert.match(html, /href="\/basarilarimiz"/i);
  assert.match(html, /aria-label="Hızlı erişim"/i);
  assert.match(html, /aria-label="WhatsApp üzerinden iletişime geçin"/i);
  assert.match(html, /href="tel:\+908502182806"/i);
  assert.match(html, /href="tel:\+903624655353"/i);
  assert.match(html, /aria-expanded="false"/i);
  assert.match(
    html,
    /<button[^>]*class="mobile-submenu-trigger"[^>]*aria-label="Bölümler alt menüsünü aç"[^>]*>[\s\S]*?<span>Bölümler<\/span>/i,
  );
  assert.doesNotMatch(html, /class="mobile-navigation-parent"/i);
  assert.doesNotMatch(html, /href="\/haberler"|>\s*Yayınlar\s*</i, "Yayınlar/Haberler was intentionally removed");
});

test("exports every primary frontend route with working internal navigation", async () => {
  const routes = [
    "/hakkimizda",
    "/okulumuz",
    "/bolumler",
    "/bolumler/kimya-teknolojileri",
    "/bolumler/elektrik-elektronik-teknolojileri",
    "/bolumler/biyomedikal-cihaz-teknolojileri",
    "/kadromuz",
    "/okul-kiyafetlerimiz",
    "/faaliyetlerimiz",
    "/galeri",
    "/basarilarimiz",
    "/rehberlik",
    "/iletisim",
    "/on-kayit",
    "/kvkk",
  ];

  for (const route of routes) {
    const html = await readRoute(route);
    assert.match(html, /<main id="main-content">|<main id="about-content">/i, `${route} needs a main landmark`);
    assert.match(html, /aria-label="Ana navigasyon"/i, `${route} needs shared navigation`);
    assert.match(html, /Dinamik Okulları/i, `${route} needs the school brand`);
  }
});

test("keeps every teaching branch separate in the staff directory", async () => {
  const html = await readRoute("/kadromuz");

  for (const branch of ["Fizik", "Biyoloji", "Tarih", "Coğrafya", "Felsefe", "Beden Eğitimi ve Spor", "Müzik", "Görsel Sanatlar"]) {
    assert.match(html, new RegExp(`>${branch}<`, "i"), `${branch} needs its own staff filter`);
  }

  assert.match(html, /Kader Danışmaz[\s\S]*Tarih Öğretmeni/i);
  assert.match(html, /Fatma Zehra Soruklu[\s\S]*Coğrafya Öğretmeni/i);
  assert.match(html, /Betül Müdür[\s\S]*Felsefe Öğretmeni/i);
  assert.match(html, /Mustafa İrfan Kütük[\s\S]*Türk Dili ve Edebiyatı Öğretmeni/i);
  assert.match(html, /Nevin Varoğlu[\s\S]*Türk Dili ve Edebiyatı Öğretmeni/i);
  assert.match(html, /src="\/uploads\/staff\/kader-danismaz\.webp"/i);
  assert.match(html, /alt="Kader Danışmaz, Tarih Öğretmeni"/i);
  assert.doesNotMatch(html, /Sosyal Bilimler|Fen Bilimleri|Spor ve Sanat/i);
});

test("publishes a clear KVKK notice and separates optional WhatsApp preference", async () => {
  const [kvkkHtml, registrationHtml] = await Promise.all([
    readRoute("/kvkk"),
    readRoute("/on-kayit"),
  ]);

  assert.match(kvkkHtml, /Ön kayıt aydınlatma metni/i);
  assert.match(kvkkHtml, /Veri sorumlusu/i);
  assert.match(kvkkHtml, /KVKK Madde 11/i);
  assert.match(kvkkHtml, /Veri güvenliği/i);
  assert.match(registrationHtml, /name="privacyNoticeAcknowledged"/i);
  assert.match(registrationHtml, /name="whatsappConsent"/i);
  assert.match(registrationHtml, /İsteğe bağlı/i);
  assert.match(registrationHtml, /href="\/kvkk#aydinlatma"/i);
});

test("redirects unauthenticated admin requests to the login page", async () => {
  const response = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
  assert.ok([307, 308, 302].includes(response.status), "unauthenticated /admin should redirect");
  const location = response.headers.get("location") ?? "";
  assert.match(location, /\/admin\/login$/);
});

test("labels active and unavailable branches according to the provided program reference", async () => {
  const [departmentsHtml, chemistryHtml, electronicsHtml, biomedicalHtml] = await Promise.all([
    readRoute("/bolumler"),
    readRoute("/bolumler/kimya-teknolojileri"),
    readRoute("/bolumler/elektrik-elektronik-teknolojileri"),
    readRoute("/bolumler/biyomedikal-cihaz-teknolojileri"),
  ]);
  const html = [departmentsHtml, chemistryHtml, electronicsHtml, biomedicalHtml].join("\n");

  assert.match(html, /Kimya Laboratuvarı Dalı/i);
  assert.match(html, /Elektrik Tesisatları ve Dağıtımı Dalı/i);
  assert.match(html, /Tıbbi Görüntüleme Sistemleri Dalı/i);
  assert.match(chemistryHtml, /Petrol Endüstrisi,[\s\S]*Okulumuzda bu dalda eğitim VERİLMEMEKTEDİR/i);
  assert.match(chemistryHtml, /Proses[\s\S]*Okulumuzda bu dalda eğitim VERİLMEMEKTEDİR/i);
  assert.match(chemistryHtml, /Sektörün ihtiyaçları doğrultusunda bilimsel ve teknolojik gelişmelere paralel mesleki yeterlikleri kazanan/i);
  assert.match(chemistryHtml, /Ultraviyole spektrofotometresi,[\s\S]*kromatografik yöntemleri kullanarak numunelerde analiz yapma/i);
  assert.match(chemistryHtml, /Alan programının toplam eğitim süresi 4 öğretim yılı olarak planlanmıştır/i);
  assert.doesNotMatch(chemistryHtml, /Teknik bilgiyi güvenli, dikkatli ve üretken bir çalışma kültürüne dönüştür/i);
  assert.ok((chemistryHtml.match(/department-branch-card is-unavailable/g) ?? []).length >= 2);

  for (const unavailableBranch of [
    "Asansör Sistemleri",
    "Elektrikli Cihazlar Teknik Servisi",
    "Elektronik ve Haberleşme",
    "Endüstriyel Bakım Onarım",
    "Savunma Elektronik Sistemleri",
  ]) {
    assert.match(electronicsHtml, new RegExp(`${unavailableBranch}[\\s\\S]*Okulumuzda bu dalda eğitim VERİLMEMEKTEDİR`, "i"));
  }
  assert.match(electronicsHtml, /Elektrik-elektronik sanayisi, küresel düzeyde hızla değişen pazar ve rekabet koşulları/i);
  assert.match(electronicsHtml, /Elektrik İç Tesisleri Yönetmeliği'ne,[\s\S]*kontrol panolarını hazırlama/i);
  assert.match(electronicsHtml, /İş sağlığı ve güvenliği tedbirlerini alarak test uygulamaları yapma ile ilgili bilgi, beceri ve yetkinliklerin kazandırılması amaçlanmaktadır/i);
  assert.match(electronicsHtml, /Alan programının toplam eğitim süresi 4 öğretim yılı olarak planlanmıştır/i);
  assert.doesNotMatch(electronicsHtml, /Teknik bilgiyi güvenli, dikkatli ve üretken bir çalışma kültürüne dönüştür/i);
  assert.ok((electronicsHtml.match(/department-branch-card is-unavailable/g) ?? []).length >= 5);

  for (const unavailableBranch of [
    "Yaşam Destek ve Tedavi Cihazları",
    "Tıbbi Laboratuvar ve Hasta Dışı Uygulama Cihazları",
    "Fizyolojik Sinyal İzleme Teşhis ve Kayıt Cihazları",
  ]) {
    assert.match(biomedicalHtml, new RegExp(`${unavailableBranch}[\\s\\S]*Okulumuzda bu dalda eğitim VERİLMEMEKTEDİR`, "i"));
  }
  assert.match(biomedicalHtml, /Biyomedikal Cihaz Teknolojileri Alanı altında yer alan dallarda,makine ve cihazların/i);
  assert.match(biomedicalHtml, /Tıbbî görüntüleme cihazlarına ilişkin kurulum şartlarını kontrol etme/i);
  assert.match(biomedicalHtml, /Ultrasonik görüntüleyicilerin,[\s\S]*kalibrasyon ve ayarlarını kontrol etmek/i);
  assert.match(biomedicalHtml, /Sabırlı, dikkatli, tedbirli ve titiz,[\s\S]*sorumluluk duygusu gelişmiş kişiler olması da gereklidir/i);
  assert.ok((biomedicalHtml.match(/department-branch-card is-unavailable/g) ?? []).length >= 3);

  assert.doesNotMatch(departmentsHtml, /Petrol Endüstrisi|Asansör Sistemleri|Yaşam Destek ve Tedavi Cihazları/i);
});

test("renders the cinematic homepage composition while preserving the brand logos", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /src="\/images\/dinamik-logo-retina\.png"/i);
  assert.match(html, /src="\/images\/footer-logo-dinamik\.png"/i);
  assert.match(html, /class="hero"/i);
  assert.doesNotMatch(html, /class="stats-section"/i);
  assert.match(html, /class="departments-footer-link"/i);
  assert.match(html, /class="hero-rail"/i);
  assert.equal((html.match(/class="hero-tile(?: hero-tile--large)?"/gi) ?? []).length, 3);
  assert.equal((html.match(/class="proof-card"/gi) ?? []).length, 2);
  assert.match(html, /class="hero-tile hero-tile--large" href="\/okulumuz#okulumuzu-taniyin"/i);
  assert.doesNotMatch(html, /class="hero-tile hero-tile--large"[^>]+href="https?:\/\/[^\"]*youtube/i);
});

test("publishes the school video gallery and links the homepage hero to it", async () => {
  const [homeHtml, schoolHtml] = await Promise.all([render().then((response) => response.text()), readRoute("/okulumuz")]);

  assert.match(homeHtml, /href="\/okulumuz#okulumuzu-taniyin"[^>]*>[\s\S]*?Okulumuzu Tanıyın/i);
  assert.match(schoolHtml, /class="school-video-feature" id="okulumuzu-taniyin"/i);
  assert.match(schoolHtml, /<video[^>]*autoplay=""[^>]*controls=""[^>]*muted=""/i);
  assert.match(schoolHtml, /src="\/uploads\/videos\/okulumuzu-taniyin\.mp4"/i);
  assert.equal((schoolHtml.match(/<video\b/gi) ?? []).length, 5);
  assert.match(schoolHtml, /Kimyada analiz ve kalite kontrol/i);
  assert.match(schoolHtml, /Elektrik - Elektronik atölyelerinde eğitim/i);
  assert.match(schoolHtml, /Biyomedikal Cihaz Teknolojileri/i);

  for (const fileName of [
    "okulumuzu-taniyin.mp4",
    "okulumuzdan-goruntuler-1.mp4",
    "okulumuzdan-goruntuler-2.mp4",
    "okulumuzdan-goruntuler-3.mp4",
    "okulumuzdan-goruntuler-4.mp4",
  ]) {
    await access(new URL(`../public/uploads/videos/${fileName}`, import.meta.url));
  }
});

test("removes disposable starter preview code and dependency", async () => {
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");

  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  await assert.rejects(access(new URL("../app/_sites-preview/preview.css", import.meta.url)));
});

test("keeps in-page links valid and document IDs unique", async () => {
  const response = await render();
  const html = await response.text();
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const hashTargets = [...html.matchAll(/\shref="#([^"]+)"/g)].map((match) => match[1]);

  assert.equal(new Set(ids).size, ids.length, "Rendered HTML contains duplicate IDs");

  for (const target of hashTargets) {
    assert.ok(ids.includes(target), `Missing target for in-page link: #${target}`);
  }
});
