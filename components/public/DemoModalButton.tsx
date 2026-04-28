"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/components/providers/lang-provider";

type FormData = {
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  mensaje?: string;
};

interface Props {
  productoId: string;
  productoNombre: string;
  label?: string;
  variant?: "primary" | "outline";
  className?: string;
}

export function DemoModalButton({
  productoId,
  productoNombre,
  label,
  variant = "primary",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const { t } = useLang();

  const schema = z.object({
    nombre: z.string().min(2, t.demo.nameError),
    email: z.string().email(t.demo.emailError),
    empresa: z.string().optional(),
    telefono: z.string().optional(),
    mensaje: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, productoId }),
      });
      if (!res.ok) throw new Error();
      setEnviado(true);
      reset();
      toast.success(t.demo.successTitle);
    } catch {
      toast.error("Error al enviar. Intenta nuevamente.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setEnviado(false), 300);
  };

  const buttonLabel = label ?? t.demo.defaultLabel;

  const baseClass =
    variant === "primary"
      ? "bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm inline-flex items-center gap-2"
      : "border border-border hover:border-[#6c63ff]/50 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2";

  return (
    <>
      <button onClick={() => setOpen(true)} className={className ?? baseClass}>
        {buttonLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative z-10 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold">{t.demo.title}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {productoNombre}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {enviado ? (
                <div className="py-8 flex flex-col items-center gap-4 text-center">
                  <div className="size-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle size={28} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-1">
                      {t.demo.successTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t.demo.successText}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="mt-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
                  >
                    {t.demo.closeButton}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        {t.demo.nameLabel} <span className="text-[#6c63ff]">*</span>
                      </label>
                      <input
                        {...register("nombre")}
                        placeholder={t.demo.namePlaceholder}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 focus:border-[#6c63ff] transition-colors"
                      />
                      {errors.nombre && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.nombre.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        {t.demo.emailLabel} <span className="text-[#6c63ff]">*</span>
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder={t.demo.emailPlaceholder}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 focus:border-[#6c63ff] transition-colors"
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        {t.demo.companyLabel}
                      </label>
                      <input
                        {...register("empresa")}
                        placeholder={t.demo.companyPlaceholder}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 focus:border-[#6c63ff] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        {t.demo.phoneLabel}
                      </label>
                      <input
                        {...register("telefono")}
                        type="tel"
                        placeholder={t.demo.phonePlaceholder}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 focus:border-[#6c63ff] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      {t.demo.messageLabel}
                    </label>
                    <textarea
                      {...register("mensaje")}
                      rows={3}
                      placeholder={t.demo.messagePlaceholder}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 focus:border-[#6c63ff] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#6c63ff] hover:bg-[#5b53e6] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 text-sm transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        {t.demo.submittingButton}
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        {t.demo.submitButton.replace("{name}", productoNombre)}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    {t.demo.disclaimer}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
