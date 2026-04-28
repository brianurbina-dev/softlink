export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get("admin") === "true";
  const session = admin ? await auth() : null;

  const articulos = await prisma.articulo.findMany({
    where: admin && session ? {} : { publicado: true },
    orderBy: { creadoEn: "desc" },
    select: {
      id: true,
      slug: true,
      titulo: true,
      tituloEn: true,
      resumen: true,
      imagen: true,
      tags: true,
      publicado: true,
      publicadoEn: true,
      creadoEn: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(articulos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { titulo, tituloEn, slug, resumen, resumenEn, contenido, contenidoEn, imagen, tags, publicado, publicadoEn } = body;

  if (!titulo || !slug || !resumen || !contenido) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const exists = await prisma.articulo.findUnique({ where: { slug } });
  if (exists) return NextResponse.json({ error: "El slug ya existe" }, { status: 409 });

  const articulo = await prisma.articulo.create({
    data: {
      titulo,
      tituloEn: tituloEn || null,
      slug,
      resumen,
      resumenEn: resumenEn || null,
      contenido,
      contenidoEn: contenidoEn || null,
      imagen: imagen || null,
      tags: tags || [],
      publicado: publicado ?? false,
      publicadoEn: publicadoEn ? new Date(publicadoEn) : null,
    },
  });
  return NextResponse.json(articulo, { status: 201 });
}
