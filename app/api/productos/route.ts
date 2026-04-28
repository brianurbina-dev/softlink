export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get("admin") === "true";
  const session = admin ? await auth() : null;

  const productos = await prisma.producto.findMany({
    where: admin && session ? {} : { activo: true },
    orderBy: { creadoEn: "desc" },
    include: { _count: { select: { demos: true } } },
  });
  return NextResponse.json(productos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { nombre, slug, descripcion, descripcionEn, descripcionLarga, descripcionLargaEn, imagen, screenshots, estado, demoUrl, precio, tipoPrecio, tecnologias, destacado, activo } = body;

  if (!nombre || !slug || !descripcion) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const exists = await prisma.producto.findUnique({ where: { slug } });
  if (exists) return NextResponse.json({ error: "El slug ya existe" }, { status: 409 });

  const producto = await prisma.producto.create({
    data: {
      nombre,
      slug,
      descripcion,
      descripcionEn: descripcionEn || null,
      descripcionLarga: descripcionLarga || null,
      descripcionLargaEn: descripcionLargaEn || null,
      imagen: imagen || null,
      screenshots: screenshots || [],
      estado: estado || "proximamente",
      demoUrl: demoUrl || null,
      precio: precio ? Number(precio) : null,
      tipoPrecio: tipoPrecio || null,
      tecnologias: tecnologias || [],
      destacado: destacado ?? false,
      activo: activo ?? true,
    },
  });
  return NextResponse.json(producto, { status: 201 });
}
