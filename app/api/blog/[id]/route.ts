export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const articulo = await prisma.articulo.findUnique({ where: { id } });
  if (!articulo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(articulo);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const articulo = await prisma.articulo.update({
    where: { id },
    data: {
      ...(body.titulo !== undefined && { titulo: body.titulo }),
      ...(body.tituloEn !== undefined && { tituloEn: body.tituloEn || null }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.resumen !== undefined && { resumen: body.resumen }),
      ...(body.resumenEn !== undefined && { resumenEn: body.resumenEn || null }),
      ...(body.contenido !== undefined && { contenido: body.contenido }),
      ...(body.contenidoEn !== undefined && { contenidoEn: body.contenidoEn || null }),
      ...(body.imagen !== undefined && { imagen: body.imagen || null }),
      ...(body.tags !== undefined && { tags: body.tags }),
      ...(body.publicado !== undefined && { publicado: body.publicado }),
      ...(body.publicadoEn !== undefined && { publicadoEn: body.publicadoEn ? new Date(body.publicadoEn) : null }),
    },
  });
  return NextResponse.json(articulo);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.articulo.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
