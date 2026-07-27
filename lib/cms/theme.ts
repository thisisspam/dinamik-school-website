import type { CSSProperties } from "react";

export const DEFAULT_SITE_THEME = {
  brandNavy: "#2d2958",
  brandNavyDeep: "#211e44",
  brandRed: "#ff0000",
  brandRedDark: "#cc0000",
  surface: "#ffffff",
  surfaceSoft: "#f7f6fa",
  ink: "#2d2958",
  muted: "#706d86",
  border: "#e5e3ec",
  headerBackground: "#ffffff",
  footerBackground: "#211e44",
  containerWidth: 1280,
  buttonRadius: 999,
  cardRadius: 18,
  shadowIntensity: 100,
} as const;

export type SiteTheme = {
  id: number;
  brandNavy: string;
  brandNavyDeep: string;
  brandRed: string;
  brandRedDark: string;
  surface: string;
  surfaceSoft: string;
  ink: string;
  muted: string;
  border: string;
  headerBackground: string;
  footerBackground: string;
  containerWidth: number;
  buttonRadius: number;
  cardRadius: number;
  shadowIntensity: number;
};

type ThemeStyle = CSSProperties & Record<`--${string}`, string | number>;

export function siteThemeStyle(theme: Omit<SiteTheme, "id">): ThemeStyle {
  const shadowScale = Math.max(0, Math.min(150, theme.shadowIntensity)) / 100;
  return {
    "--brand-navy": theme.brandNavy,
    "--brand-navy-deep": theme.brandNavyDeep,
    "--brand-red": theme.brandRed,
    "--brand-red-dark": theme.brandRedDark,
    "--navy-950": theme.brandNavyDeep,
    "--navy-900": theme.brandNavy,
    "--ink": theme.ink,
    "--ink-soft": theme.ink,
    "--muted": theme.muted,
    "--teal": theme.brandRed,
    "--teal-dark": theme.brandRedDark,
    "--green": theme.brandRedDark,
    "--blue": theme.brandNavy,
    "--surface": theme.surface,
    "--surface-soft": theme.surfaceSoft,
    "--surface-blue": theme.surfaceSoft,
    "--border": theme.border,
    "--header-background": theme.headerBackground,
    "--footer-background": theme.footerBackground,
    "--container": `${theme.containerWidth}px`,
    "--button-radius": `${theme.buttonRadius}px`,
    "--card-radius": `${theme.cardRadius}px`,
    "--shadow-sm": `0 8px 24px rgba(45, 41, 88, ${0.08 * shadowScale})`,
    "--shadow-md": `0 22px 60px rgba(45, 41, 88, ${0.14 * shadowScale})`,
  };
}
