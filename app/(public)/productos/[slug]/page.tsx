import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductoView } from "@/components/public/ProductoView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await prisma.producto.findUnique({ where: { slug } });
  if (!producto) return { title: "Producto no encontrado | Softlink" };
  return {
    title: `${producto.nombre} | Softlink`,
    description: producto.descripcion,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion,
      images: producto.imagen ? [producto.imagen] : [],
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const producto = await prisma.producto.findUnique({
    where: { slug, activo: true },
    select: {
      id: true,
      slug: true,
      nombre: true,
      descripcion: true,
      descripcionEn: true,
      descripcionLarga: true,
      descripcionLargaEn: true,
      imagen: true,
      screenshots: true,
      estado: true,
      demoUrl: true,
      precio: true,
      tipoPrecio: true,
      tecnologias: true,
      destacado: true,
    },
  });

  if (!producto) notFound();

  return <ProductoView producto={producto} />;
}
