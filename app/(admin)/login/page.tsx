"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    const res = await signIn("credentials", { ...data, redirect: false });
    if (res?.error) {
      setError("Credenciales incorrectas");
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold">Soft<span className="text-[#6c63ff]">link</span></span>
          <p className="text-sm text-muted-foreground mt-1">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-card p-7 space-y-4">
          <div className="flex justify-center mb-2">
            <div className="size-10 rounded-xl bg-[#6c63ff]/10 flex items-center justify-center text-[#6c63ff]">
              <Lock size={18} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input {...register("email")} type="email" placeholder="admin@softlink.cl"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 focus:border-[#6c63ff] transition-colors" />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Contraseña</label>
            <input {...register("password")} type="password" placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 focus:border-[#6c63ff] transition-colors" />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          {error && <p className="text-xs text-destructive text-center bg-destructive/5 rounded-lg py-2">{error}</p>}

          <button type="submit" disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#6c63ff] hover:bg-[#5b53e6] disabled:opacity-60 text-white font-medium py-2.5 text-sm transition-colors">
            {isSubmitting ? <><Loader2 size={15} className="animate-spin" />Entrando...</> : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
