export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const testimonio = await prisma.testimonio.update({
    where: { id },
    data: {
      ...(body.nombre !== undefined && { nombre: body.nombre }),
      ...(body.cargo !== undefined && { cargo: body.cargo }),
      ...(body.cargoEn !== undefined && { cargoEn: body.cargoEn || null }),
      ...(body.empresa !== undefined && { empresa: body.empresa }),
      ...(body.foto !== undefined && { foto: body.foto || null }),
      ...(body.texto !== undefined && { texto: body.texto }),
      ...(body.textoEn !== undefined && { textoEn: body.textoEn || null }),
      ...(body.estrellas !== undefined && { estrellas: Number(body.estrellas) }),
      ...(body.orden !== undefined && { orden: Number(body.orden) }),
      ...(body.activo !== undefined && { activo: body.activo }),
    },
  });
  return NextResponse.json(testimonio);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.testimonio.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
