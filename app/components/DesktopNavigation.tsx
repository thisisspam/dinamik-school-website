"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NavigationItem } from "./navigation";

export function DesktopNavigation({ navigation }: { navigation: NavigationItem[] }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (navigationRef.current && !event.composedPath().includes(navigationRef.current)) {
        setOpenMenu(null);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || openMenu === null) return;

      navigationRef.current
        ?.querySelector<HTMLButtonElement>('.desktop-nav-trigger[aria-expanded="true"]')
        ?.focus();
      setOpenMenu(null);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [openMenu]);

  return (
    <nav ref={navigationRef} className="desktop-nav" aria-label="Ana navigasyon">
      {navigation.map((item, index) => {
        if (!item.children?.length) {
          return (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          );
        }

        const menuKey = item.label;
        const submenuId = `desktop-submenu-${index}`;
        const isOpen = openMenu === menuKey;

        return (
          <div
            className={`desktop-nav-item${isOpen ? " is-open" : ""}`}
            key={menuKey}
            onMouseEnter={() => setOpenMenu(menuKey)}
            onMouseLeave={() => setOpenMenu(null)}
            onFocusCapture={() => setOpenMenu(menuKey)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setOpenMenu(null);
              }
            }}
          >
            <div className="desktop-nav-label">
              <Link className="desktop-nav-trigger" href={item.href}>
                {item.label}
              </Link>
              <button
                className="desktop-nav-toggle"
                type="button"
                aria-label={`${item.label} alt menüsünü ${isOpen ? "kapat" : "aç"}`}
                aria-expanded={isOpen}
                aria-controls={submenuId}
                aria-haspopup="true"
                onClick={() => setOpenMenu(isOpen ? null : menuKey)}
              >
                <ChevronDown size={14} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
            <div className="desktop-submenu" id={submenuId} hidden={!isOpen}>
              {item.children.map((child) => (
                <Link key={child.href} href={child.href} onClick={() => setOpenMenu(null)}>
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
