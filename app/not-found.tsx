import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Decorative number */}
      <div className="relative mb-6 select-none">
        <span className="text-[160px] sm:text-[200px] font-black leading-none text-[#6c63ff]/10">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-20 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center">
            <span className="text-3xl font-bold text-[#6c63ff]">S</span>
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
        Página no encontrada
      </h1>
      <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
        La página que buscas no existe o fue movida. Vuelve al inicio o
        explora nuestros productos.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Volver al inicio
        </Link>
        <Link
          href="/#productos"
          className="border border-border hover:border-[#6c63ff]/50 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Ver productos
        </Link>
      </div>

      <p className="mt-12 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Softlink SpA · Santiago, Chile
      </p>
    </div>
  );
}
