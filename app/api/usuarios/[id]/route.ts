export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session) return null;
  const user = await prisma.usuario.findUnique({ where: { email: (session.user as { email: string }).email } });
  if (!user || user.rol !== "super_admin") return null;
  return user;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (body.nombre !== undefined) data.nombre = body.nombre;
  if (body.email !== undefined) data.email = body.email;
  if (body.rol !== undefined) data.rol = body.rol;
  if (body.activo !== undefined) data.activo = body.activo;
  if (body.password) data.password = await bcrypt.hash(body.password, 12);

  const usuario = await prisma.usuario.update({
    where: { id },
    data,
    select: { id: true, email: true, nombre: true, rol: true, activo: true, creadoEn: true },
  });
  return NextResponse.json(usuario);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (id === admin.id) return NextResponse.json({ error: "No puedes eliminarte a ti mismo" }, { status: 400 });

  await prisma.usuario.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
