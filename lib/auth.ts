import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const usuario = await prisma.usuario.findUnique({
          where: { email: parsed.data.email },
        });
        if (!usuario || !usuario.activo) return null;

        const valid = await bcrypt.compare(parsed.data.password, usuario.password);
        if (!valid) return null;

        return { id: usuario.id, email: usuario.email, name: usuario.nombre, rol: usuario.rol };
      },
    }),
  ],
});
