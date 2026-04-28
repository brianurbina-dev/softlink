"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, MessageCircle, Mail, MapPin, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/components/providers/lang-provider";

type FormData = {
  nombre: string;
  email: string;
  empresa?: string;
  mensaje: string;
};

export function Contacto() {
  const [enviado, setEnviado] = useState(false);
  const { t } = useLang();

  const schema = z.object({
    nombre: z.string().min(2, t.contact.nameError),
    email: z.string().email(t.contact.emailError),
    empresa: z.string().optional(),
    mensaje: z.string().min(10, t.contact.messageError),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setEnviado(true);
      reset();
      toast.success(t.contact.successTitle);
    } catch {
      toast.error("Error al enviar. Intenta nuevamente.");
    }
  };

  return (
    <section id="contacto" className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-[#6c63ff]">
              {t.contact.label}
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              {t.contact.title}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {t.contact.subtitle}
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-[#6c63ff]/10 flex items-center justify-center text-[#6c63ff] shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">{t.contact.emailLabel}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">contacto@softlink.cl</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-[#6c63ff]/10 flex items-center justify-center text-[#6c63ff] shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">{t.contact.locationLabel}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t.contact.locationValue}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-[#6c63ff]/10 flex items-center justify-center text-[#6c63ff] shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">{t.contact.whatsappLabel}</p>
                  <a
                    href="https://wa.me/56912345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#6c63ff] hover:text-[#a78bfa] transition-colors mt-0.5 inline-block"
                  >
                    +56 9 1234 5678 →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {enviado ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center flex flex-col items-center gap-4">
                <CheckCircle size={40} className="text-emerald-500" />
                <h3 className="text-lg font-semibold">{t.contact.successTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.contact.successText}
                </p>
                <button
                  onClick={() => setEnviado(false)}
                  className="text-sm text-[#6c63ff] hover:underline mt-2"
                >
                  {t.contact.sendAnother}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-2xl border border-border bg-card p-7 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      {t.contact.nameLabel} <span className="text-[#6c63ff]">*</span>
                    </label>
                    <input
                      {...register("nombre")}
                      placeholder={t.contact.namePlaceholder}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 focus:border-[#6c63ff] transition-colors"
                    />
                    {errors.nombre && (
                      <p className="text-xs text-destructive mt-1">{errors.nombre.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      {t.contact.emailLabel} <span className="text-[#6c63ff]">*</span>
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder={t.contact.emailPlaceholder}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 focus:border-[#6c63ff] transition-colors"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">{t.contact.companyLabel}</label>
                  <input
                    {...register("empresa")}
                    placeholder={t.contact.companyPlaceholder}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 focus:border-[#6c63ff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {t.contact.messageLabel} <span className="text-[#6c63ff]">*</span>
                  </label>
                  <textarea
                    {...register("mensaje")}
                    rows={4}
                    placeholder={t.contact.messagePlaceholder}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 focus:border-[#6c63ff] transition-colors resize-none"
                  />
                  {errors.mensaje && (
                    <p className="text-xs text-destructive mt-1">{errors.mensaje.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#6c63ff] hover:bg-[#5b53e6] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 text-sm transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      {t.contact.sendingButton}
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      {t.contact.sendButton}
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  {t.contact.responseTime}
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
