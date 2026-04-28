import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://softlink.cl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articulos, productos] = await Promise.all([
    prisma.articulo.findMany({ where: { publicado: true }, select: { slug: true, updatedAt: true } }),
    prisma.producto.findMany({ where: { activo: true }, select: { slug: true, creadoEn: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = articulos.map((a) => ({
    url: `${BASE_URL}/blog/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${BASE_URL}/productos/${p.slug}`,
    lastModified: p.creadoEn,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
