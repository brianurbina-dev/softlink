"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLang } from "@/components/providers/lang-provider";

interface Testimonio {
  id: string;
  nombre: string;
  cargo: string;
  cargoEn?: string | null;
  empresa: string;
  foto?: string | null;
  texto: string;
  textoEn?: string | null;
  estrellas: number;
}

const GRADIENTS = [
  "from-pink-400 to-rose-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-[#6c63ff] to-[#a78bfa]",
];

function Avatar({ persona, idx }: { persona: Testimonio; idx: number }) {
  const iniciales = persona.nombre.split(" ").map(n => n[0]).slice(0, 2).join("");
  if (persona.foto) {
    return (
      <div className="size-9 rounded-full overflow-hidden shrink-0">
        <Image src={persona.foto} alt={persona.nombre} width={36} height={36} className="object-cover w-full h-full" />
      </div>
    );
  }
  return (
    <div className={`size-9 rounded-full bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {iniciales}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Testimonios({ testimonios }: { testimonios: Testimonio[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { t, lang } = useLang();

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonios.length);
  }, [testimonios.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonios.length) % testimonios.length);
  }, [testimonios.length]);

  useEffect(() => {
    if (testimonios.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, testimonios.length]);

  if (testimonios.length === 0) return null;

  const current_t = testimonios[current];
  const current_texto = lang === "en" && current_t.textoEn ? current_t.textoEn : current_t.texto;
  const current_cargo = lang === "en" && current_t.cargoEn ? current_t.cargoEn : current_t.cargo;

  return (
    <section id="testimonios" className="py-24 bg-card/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6c63ff]">
            {t.testimonials.label}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            {t.testimonials.title}
          </h2>
        </motion.div>

        {/* Desktop: grid */}
        <div className={`hidden lg:grid gap-5 ${testimonios.length <= 2 ? "grid-cols-2 max-w-3xl mx-auto" : testimonios.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {testimonios.map((item, i) => {
            const texto = lang === "en" && item.textoEn ? item.textoEn : item.texto;
            const cargo = lang === "en" && item.cargoEn ? item.cargoEn : item.cargo;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: item.estrellas }).map((_, j) => (
                    <Star key={j} size={13} className="fill-[#6c63ff] text-[#6c63ff]" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{texto}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <Avatar persona={item} idx={i} />
                  <div>
                    <p className="text-sm font-semibold leading-tight">{item.nombre}</p>
                    <p className="text-xs text-muted-foreground">{cargo} · {item.empresa}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: slider */}
        <div className="lg:hidden">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 min-h-[280px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current_t.id}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: current_t.estrellas }).map((_, j) => (
                    <Star key={j} size={13} className="fill-[#6c63ff] text-[#6c63ff]" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{current_texto}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <Avatar persona={current_t} idx={current} />
                  <div>
                    <p className="text-sm font-semibold">{current_t.nombre}</p>
                    <p className="text-xs text-muted-foreground">{current_cargo} · {current_t.empresa}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={prev} className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[#6c63ff]/50 transition-colors">
              <ChevronLeft size={15} />
            </button>
            <div className="flex gap-1.5">
              {testimonios.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={cn("size-1.5 rounded-full transition-all", i === current ? "bg-[#6c63ff] w-4" : "bg-border")} />
              ))}
            </div>
            <button onClick={next} className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[#6c63ff]/50 transition-colors">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
