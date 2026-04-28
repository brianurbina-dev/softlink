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

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const usuarios = await prisma.usuario.findMany({
    orderBy: { creadoEn: "desc" },
    select: { id: true, email: true, nombre: true, rol: true, activo: true, creadoEn: true },
  });
  return NextResponse.json(usuarios);
}

export async function POST(req: NextRequest) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { nombre, email, password, rol, activo } = await req.json();
  if (!nombre || !email || !password) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const exists = await prisma.usuario.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });

  const hashed = await bcrypt.hash(password, 12);
  const usuario = await prisma.usuario.create({
    data: { nombre, email, password: hashed, rol: rol || "viewer", activo: activo ?? true },
    select: { id: true, email: true, nombre: true, rol: true, activo: true, creadoEn: true },
  });
  return NextResponse.json(usuario, { status: 201 });
}
