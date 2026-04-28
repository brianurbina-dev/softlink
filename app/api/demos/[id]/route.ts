export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emailDemoConfirmada } from "@/lib/emails";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { estado } = await req.json();

  const demo = await prisma.solicitudDemo.update({
    where: { id },
    data: { estado },
    include: { producto: { select: { nombre: true } } },
  });

  if (estado === "confirmada" && process.env.RESEND_API_KEY) {
    const { resend } = await import("@/lib/resend");
    const email = emailDemoConfirmada({ nombre: demo.nombre, email: demo.email, productoNombre: demo.producto.nombre });
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: demo.email,
      subject: email.subject,
      html: email.html,
    });
  }

  return NextResponse.json(demo);
}
