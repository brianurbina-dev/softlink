"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLang } from "@/components/providers/lang-provider";

interface Integrante {
  id: string;
  nombre: string;
  cargo: string;
  cargoEn?: string | null;
  descripcion: string;
  descripcionEn?: string | null;
  foto?: string | null;
  linkedin?: string | null;
  github?: string | null;
}

const GRADIENTS = [
  "from-[#6c63ff] to-[#a78bfa]",
  "from-[#a78bfa] to-[#6c63ff]",
  "from-[#6c63ff] to-blue-500",
  "from-emerald-400 to-[#6c63ff]",
];

function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function Equipo({ integrantes }: { integrantes: Integrante[] }) {
  const { t, lang } = useLang();
  return (
    <section id="equipo" className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6c63ff]">
            {t.team.label}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            {t.team.title}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            {t.team.subtitle}
          </p>
        </motion.div>

        <div className={`grid sm:grid-cols-2 gap-8 ${integrantes.length <= 2 ? "max-w-3xl mx-auto" : "lg:grid-cols-3 max-w-5xl mx-auto"}`}>
          {integrantes.map((persona, i) => {
            const iniciales = persona.nombre.split(" ").map(n => n[0]).slice(0, 2).join("");
            const gradient = GRADIENTS[i % GRADIENTS.length];
            const cargo = lang === "en" && persona.cargoEn ? persona.cargoEn : persona.cargo;
            const descripcion = lang === "en" && persona.descripcionEn ? persona.descripcionEn : persona.descripcion;
            return (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group flex flex-col items-center text-center rounded-2xl border border-border bg-card p-8 hover:border-[#6c63ff]/40 hover:shadow-xl hover:shadow-[#6c63ff]/5 transition-all duration-300"
              >
                <div className="relative mb-5">
                  {persona.foto ? (
                    <div className="size-24 rounded-full overflow-hidden shadow-lg">
                      <Image src={persona.foto} alt={persona.nombre} width={96} height={96} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className={`size-24 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                      {iniciales}
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-400 border-2 border-card" />
                </div>

                <h3 className="text-lg font-semibold">{persona.nombre}</h3>
                <p className="text-sm text-[#6c63ff] font-medium mt-0.5">{cargo}</p>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{descripcion}</p>

                <div className="mt-6 flex items-center gap-3">
                  {persona.linkedin && (
                    <a href={persona.linkedin} target="_blank" rel="noreferrer"
                      className="size-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-[#6c63ff] hover:bg-[#6c63ff]/10 transition-colors"
                      aria-label="LinkedIn">
                      <IconLinkedin />
                    </a>
                  )}
                  {persona.github && (
                    <a href={persona.github} target="_blank" rel="noreferrer"
                      className="size-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-[#6c63ff] hover:bg-[#6c63ff]/10 transition-colors"
                      aria-label="GitHub">
                      <IconGithub />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
