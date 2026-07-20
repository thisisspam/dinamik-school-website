export type NavigationItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

export const siteNavigation: NavigationItem[] = [
  { label: "Anasayfa", href: "/" },
  {
    label: "Bölümler",
    href: "/bolumler",
    children: [
      { label: "Kimya Teknolojileri", href: "/bolumler/kimya-teknolojileri" },
      {
        label: "Elektrik - Elektronik",
        href: "/bolumler/elektrik-elektronik-teknolojileri",
      },
      {
        label: "Biyomedikal Cihaz",
        href: "/bolumler/biyomedikal-cihaz-teknolojileri",
      },
    ],
  },
  {
    label: "Okulumuz",
    href: "/okulumuz",
    children: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Okul Kıyafetlerimiz", href: "/okul-kiyafetlerimiz" },
      { label: "Rehberlik", href: "/rehberlik" },
    ],
  },
  { label: "Kadromuz", href: "/kadromuz" },
  {
    label: "Galeri",
    href: "/galeri",
    children: [
      { label: "Sosyal, Kültürel ve Sportif Çalışmalar", href: "/faaliyetlerimiz" },
    ],
  },
  { label: "Başarılar", href: "/basarilarimiz" },
  { label: "İletişim", href: "/iletisim" },
];
