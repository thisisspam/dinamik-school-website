"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function ScrollAwareHeader({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const updateScrollState = () => {
      if (animationFrameId !== null) return;

      animationFrameId = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 0);
        animationFrameId = null;
      });
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
      {children}
    </header>
  );
}
