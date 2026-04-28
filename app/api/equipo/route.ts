export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const integrantes = await prisma.integrante.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });
  return NextResponse.json(integrantes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { nombre, cargo, cargoEn, descripcion, descripcionEn, foto, linkedin, github, orden, activo } = body;

  if (!nombre || !cargo || !descripcion) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const integrante = await prisma.integrante.create({
    data: {
      nombre,
      cargo,
      cargoEn: cargoEn || null,
      descripcion,
      descripcionEn: descripcionEn || null,
      foto: foto || null,
      linkedin: linkedin || null,
      github: github || null,
      orden: Number(orden) || 0,
      activo: activo ?? true,
    },
  });
  return NextResponse.json(integrante, { status: 201 });
}
