"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { NavigationItem } from "./navigation";

type MobileNavigationProps = {
  navigation: NavigationItem[];
  ctaHref?: string;
};

export function MobileNavigation({ navigation, ctaHref = "#on-kayit" }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setIsOpen(false);
    setOpenSubmenu(null);
  };

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      closeMenu();
      menuButtonRef.current?.focus();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <div className={`mobile-menu${isOpen ? " is-open" : ""}`}>
      <button
        ref={menuButtonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
      </button>
      <nav id={menuId} aria-label="Mobil navigasyon" hidden={!isOpen}>
        {navigation.map((item, index) => {
          if (!item.children?.length) {
            return (
              <Link key={item.label} href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            );
          }

          const submenuId = `${menuId}-submenu-${index}`;
          const isSubmenuOpen = openSubmenu === item.label;

          return (
            <div className="mobile-navigation-group" key={item.label}>
              <div className={`mobile-submenu-trigger${isSubmenuOpen ? " is-open" : ""}`}>
                <Link href={item.href} onClick={closeMenu}>{item.label}</Link>
                <button
                  type="button"
                  aria-label={`${item.label} alt menüsünü ${isSubmenuOpen ? "kapat" : "aç"}`}
                  aria-expanded={isSubmenuOpen}
                  aria-controls={submenuId}
                  aria-haspopup="true"
                  onClick={() => setOpenSubmenu(isSubmenuOpen ? null : item.label)}
                >
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
              </div>
              <div className="mobile-submenu" id={submenuId} hidden={!isSubmenuOpen}>
                {item.children.map((child) => (
                  <Link key={child.href} href={child.href} onClick={closeMenu}>
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        <Link className="mobile-menu-cta" href={ctaHref} onClick={closeMenu}>
          Ön Kayıt Talebi
        </Link>
      </nav>
    </div>
  );
}
