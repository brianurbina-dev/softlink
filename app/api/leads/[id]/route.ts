export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ estado: z.enum(["nuevo", "en_contacto", "cerrado", "descartado"]) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = schema.parse(await req.json());
  const lead = await prisma.lead.update({ where: { id }, data: body });
  return NextResponse.json(lead);
}
