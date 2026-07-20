import type { MetadataRoute } from "next";
import { getDepartments } from "./data/departments";

export const dynamic = "force-static";

const baseUrl = "https://samsun.dinamikokullari.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const departments = await getDepartments();
  const routes = ["", "/bolumler", "/okulumuz", "/hakkimizda", "/okul-kiyafetlerimiz", "/kadromuz", "/faaliyetlerimiz", "/galeri", "/basarilarimiz", "/rehberlik", "/iletisim", "/on-kayit", "/kvkk"];
  return [
    ...routes.map((route) => ({ url: `${baseUrl}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.7 })),
    ...departments.map((department) => ({ url: `${baseUrl}/bolumler/${department.slug}`, changeFrequency: "yearly" as const, priority: 0.8 })),
  ];
}
