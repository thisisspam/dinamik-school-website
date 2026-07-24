"use client";

import type { MouseEvent, ReactNode } from "react";

type ScrollToSectionLinkProps = {
  targetId: string;
  scrollTargetId?: string;
  className?: string;
  children: ReactNode;
};

export function ScrollToSectionLink({
  targetId,
  scrollTargetId,
  className,
  children,
}: ScrollToSectionLinkProps) {
  const targetHash = `#${targetId}`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const targetElement = document.getElementById(scrollTargetId ?? targetId);
    if (!targetElement) return;

    event.preventDefault();

    if (window.location.hash !== targetHash) {
      window.history.pushState(null, "", targetHash);
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    targetElement.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <a className={className} href={targetHash} onClick={handleClick}>
      {children}
    </a>
  );
}
