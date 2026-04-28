export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { emailNuevaDemo } from "@/lib/emails";
import { checkRateLimit } from "@/lib/ratelimit";

const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  empresa: z.string().optional(),
  telefono: z.string().optional(),
  mensaje: z.string().optional(),
  productoId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const { success } = await checkRateLimit(ip);
    if (!success) return NextResponse.json({ error: "Demasiadas solicitudes. Intenta en una hora." }, { status: 429 });

    const body = await req.json();
    const data = schema.parse(body);

    const producto = await prisma.producto.findUnique({
      where: { id: data.productoId },
      select: { nombre: true, slug: true },
    });
    if (!producto) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

    await prisma.solicitudDemo.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        empresa: data.empresa ?? null,
        telefono: data.telefono ?? null,
        mensaje: data.mensaje ?? null,
        productoId: data.productoId,
        estado: "pendiente",
      },
    });

    if (process.env.RESEND_API_KEY) {
      const { resend } = await import("@/lib/resend");
      const emails = emailNuevaDemo({ ...data, productoNombre: producto.nombre });

      await Promise.all([
        resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: process.env.EMAIL_TO!,
          subject: emails.adminSubject,
          html: emails.adminHtml,
        }),
        resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: data.email,
          subject: emails.clientSubject,
          html: emails.clientHtml,
        }),
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
