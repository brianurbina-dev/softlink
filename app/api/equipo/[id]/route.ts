export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const integrante = await prisma.integrante.update({
    where: { id },
    data: {
      ...(body.nombre !== undefined && { nombre: body.nombre }),
      ...(body.cargo !== undefined && { cargo: body.cargo }),
      ...(body.cargoEn !== undefined && { cargoEn: body.cargoEn || null }),
      ...(body.descripcion !== undefined && { descripcion: body.descripcion }),
      ...(body.descripcionEn !== undefined && { descripcionEn: body.descripcionEn || null }),
      ...(body.foto !== undefined && { foto: body.foto || null }),
      ...(body.linkedin !== undefined && { linkedin: body.linkedin || null }),
      ...(body.github !== undefined && { github: body.github || null }),
      ...(body.orden !== undefined && { orden: Number(body.orden) }),
      ...(body.activo !== undefined && { activo: body.activo }),
    },
  });
  return NextResponse.json(integrante);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.integrante.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
