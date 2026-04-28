"use client";

import { motion } from "framer-motion";

const ITEMS = [
  { name: "Café Americano", qty: 2, price: 3200 },
  { name: "Empanada Queso", qty: 1, price: 1800 },
  { name: "Jugo Natural", qty: 3, price: 2400 },
];

const total = ITEMS.reduce((acc, i) => acc + i.price * i.qty, 0);

export function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="relative w-full max-w-sm mx-auto lg:mx-0"
    >
      {/* Glow behind the card */}
      <div className="absolute -inset-4 bg-[#6c63ff]/20 rounded-3xl blur-2xl opacity-60 dark:opacity-40" />

      {/* Floating card */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-2xl border border-white/10 bg-[#13131a]/90 dark:bg-[#13131a]/95 backdrop-blur-sm shadow-2xl overflow-hidden"
      >
        {/* Header bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0a0a0f]/60">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/70" />
            <span className="size-2.5 rounded-full bg-yellow-400/70" />
            <span className="size-2.5 rounded-full bg-green-400/70" />
          </div>
          <span className="ml-2 text-xs text-white/30 font-mono">
            Softlink POS — v2.1
          </span>
        </div>

        <div className="p-4 space-y-4">
          {/* Top stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Ventas hoy", value: "34" },
              { label: "Ingreso", value: "$182K" },
              { label: "Pendientes", value: "3" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg bg-white/5 p-2 text-center"
              >
                <p className="text-[10px] text-white/40">{s.label}</p>
                <p className="text-sm font-semibold text-white/90">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Current order */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">
              Orden actual
            </p>
            <div className="space-y-1.5">
              {ITEMS.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="size-4 rounded bg-[#6c63ff]/20 flex items-center justify-center text-[9px] font-bold text-[#a78bfa]">
                      {item.qty}
                    </span>
                    <span className="text-white/70">{item.name}</span>
                  </div>
                  <span className="text-white/50 font-mono text-[10px]">
                    ${(item.price * item.qty).toLocaleString("es-CL")}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Divider + total */}
          <div className="border-t border-white/5 pt-3 flex justify-between items-center">
            <span className="text-xs text-white/40">Total</span>
            <span className="text-base font-bold text-[#a78bfa] font-mono">
              ${total.toLocaleString("es-CL")}
            </span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-lg bg-white/5 py-2 text-xs text-white/50 hover:bg-white/10 transition-colors">
              Nueva orden
            </button>
            <button className="rounded-lg bg-[#6c63ff] py-2 text-xs text-white font-medium hover:bg-[#5b53e6] transition-colors">
              Cobrar
            </button>
          </div>
        </div>
      </motion.div>

      {/* Floating badge — "En línea" */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1"
      >
        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-medium text-emerald-400">En línea</span>
      </motion.div>
    </motion.div>
  );
}
