export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get("admin") === "true";
  const session = admin ? await auth() : null;

  const testimonios = await prisma.testimonio.findMany({
    where: admin && session ? {} : { activo: true },
    orderBy: { orden: "asc" },
  });
  return NextResponse.json(testimonios);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { nombre, cargo, cargoEn, empresa, foto, texto, textoEn, estrellas, orden, activo } = body;

  if (!nombre || !cargo || !empresa || !texto) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const testimonio = await prisma.testimonio.create({
    data: {
      nombre,
      cargo,
      cargoEn: cargoEn || null,
      empresa,
      foto: foto || null,
      texto,
      textoEn: textoEn || null,
      estrellas: Number(estrellas) || 5,
      orden: Number(orden) || 0,
      activo: activo ?? true,
    },
  });
  return NextResponse.json(testimonio, { status: 201 });
}
