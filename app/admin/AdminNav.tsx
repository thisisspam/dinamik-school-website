"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, ContactRound, Images, LayoutDashboard, LayoutTemplate, Settings2, Shapes } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/bilesenler", label: "Bileşenler", icon: LayoutTemplate },
  { href: "/admin/bolumler", label: "Bölümler", icon: Shapes },
  { href: "/admin/basvurular", label: "Ön Kayıtlar", icon: ClipboardList },
  { href: "/admin/kadromuz", label: "Kadromuz", icon: ContactRound },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings2 },
];

export function AdminNav({ newApplicationCount = 0 }: { newApplicationCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="admin-nav" aria-label="Yönetim menüsü">
      <span className="admin-nav-label">Yönetim</span>
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-link${isActive ? " is-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon aria-hidden="true" size={18} strokeWidth={2} />
            <span>{item.label}</span>
            {item.href === "/admin/basvurular" && newApplicationCount > 0 ? (
              <span className="admin-nav-count" aria-label={`${newApplicationCount} yeni başvuru`}>{newApplicationCount > 99 ? "99+" : newApplicationCount}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
