export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const config = await prisma.configSitio.findMany({ orderBy: { clave: "asc" } });
  const map = Object.fromEntries(config.map((c: { clave: string; valor: string }) => [c.clave, c.valor]));
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as Record<string, string>;

  const ops = Object.entries(body).map(([clave, valor]) =>
    prisma.configSitio.upsert({
      where: { clave },
      update: { valor },
      create: { clave, valor },
    })
  );
  await Promise.all(ops);
  return NextResponse.json({ ok: true });
}
