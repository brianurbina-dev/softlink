export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const producto = await prisma.producto.update({
    where: { id },
    data: {
      ...(body.nombre !== undefined && { nombre: body.nombre }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.descripcion !== undefined && { descripcion: body.descripcion }),
      ...(body.descripcionEn !== undefined && { descripcionEn: body.descripcionEn || null }),
      ...(body.descripcionLarga !== undefined && { descripcionLarga: body.descripcionLarga || null }),
      ...(body.descripcionLargaEn !== undefined && { descripcionLargaEn: body.descripcionLargaEn || null }),
      ...(body.imagen !== undefined && { imagen: body.imagen || null }),
      ...(body.screenshots !== undefined && { screenshots: body.screenshots }),
      ...(body.estado !== undefined && { estado: body.estado }),
      ...(body.demoUrl !== undefined && { demoUrl: body.demoUrl || null }),
      ...(body.precio !== undefined && { precio: body.precio ? Number(body.precio) : null }),
      ...(body.tipoPrecio !== undefined && { tipoPrecio: body.tipoPrecio || null }),
      ...(body.tecnologias !== undefined && { tecnologias: body.tecnologias }),
      ...(body.destacado !== undefined && { destacado: body.destacado }),
      ...(body.activo !== undefined && { activo: body.activo }),
    },
  });
  return NextResponse.json(producto);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.producto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
