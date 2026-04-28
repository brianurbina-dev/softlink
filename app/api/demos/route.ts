export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const demos = await prisma.solicitudDemo.findMany({
    orderBy: { creadoEn: "desc" },
    include: { producto: { select: { nombre: true, slug: true } } },
  });
  return NextResponse.json(demos);
}
