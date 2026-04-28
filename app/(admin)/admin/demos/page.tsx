"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, CheckCircle, XCircle, CheckCheck } from "lucide-react";

type EstadoDemo = "pendiente" | "confirmada" | "rechazada" | "realizada";

interface Demo {
  id: string;
  nombre: string;
  email: string;
  empresa?: string | null;
  telefono?: string | null;
  mensaje?: string | null;
  estado: EstadoDemo;
  creadoEn: string;
  producto: { nombre: string; slug: string };
}

const ESTADOS: { value: EstadoDemo | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "rechazada", label: "Rechazada" },
  { value: "realizada", label: "Realizada" },
];

const BADGE: Record<EstadoDemo, string> = {
  pendiente: "bg-amber-500/10 text-amber-500",
  confirmada: "bg-blue-500/10 text-blue-500",
  rechazada: "bg-red-500/10 text-red-500",
  realizada: "bg-emerald-500/10 text-emerald-500",
};

export default function DemosPage() {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<EstadoDemo | "todos">("todos");
  const [busqueda, setBusqueda] = useState("");
  const [selected, setSelected] = useState<Demo | null>(null);

  useEffect(() => {
    fetch("/api/demos").then(r => r.json()).then((d: Demo[]) => { setDemos(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cambiarEstado = async (id: string, estado: EstadoDemo) => {
    await fetch(`/api/demos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estado }) });
    setDemos(prev => prev.map(d => d.id === id ? { ...d, estado } : d));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, estado } : null);
  };

  const filtrados = demos.filter(d =>
    (filtro === "todos" || d.estado === filtro) &&
    (d.nombre.toLowerCase().includes(busqueda.toLowerCase()) || d.email.toLowerCase().includes(busqueda.toLowerCase()) || d.producto.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="space-y-5 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Solicitudes de Demo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{demos.length} solicitudes recibidas</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por nombre, email o producto..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ESTADOS.map(e => (
            <button key={e.value} onClick={() => setFiltro(e.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filtro === e.value ? "bg-[#6c63ff] text-white" : "border border-border hover:bg-accent"}`}>
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5 min-h-0" style={{ height: "calc(100vh - 230px)" }}>
        <div className="flex-1 overflow-auto rounded-xl border border-border bg-card">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Cargando...</div>
          ) : filtrados.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Sin resultados</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left">
                  {["Solicitante", "Producto", "Estado", "Fecha"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(demo => (
                  <tr key={demo.id} onClick={() => setSelected(demo)}
                    className={`border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${selected?.id === demo.id ? "bg-[#6c63ff]/5" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{demo.nombre}</p>
                      <p className="text-xs text-muted-foreground">{demo.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{demo.producto.nombre}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${BADGE[demo.estado]}`}>{demo.estado}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(demo.creadoEn).toLocaleDateString("es-CL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div className="w-72 shrink-0 rounded-xl border border-border bg-card p-5 space-y-4 overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{selected.nombre}</p>
                <p className="text-xs text-muted-foreground">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
            </div>

            {selected.empresa && <p className="text-sm text-muted-foreground">🏢 {selected.empresa}</p>}
            {selected.telefono && <p className="text-sm text-muted-foreground">📞 {selected.telefono}</p>}

            <div>
              <p className="text-xs font-medium mb-1">Producto</p>
              <p className="text-sm">{selected.producto.nombre}</p>
            </div>

            {selected.mensaje && (
              <div>
                <p className="text-xs font-medium mb-1">Mensaje</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{selected.mensaje}</p>
              </div>
            )}

            {selected.estado === "pendiente" && (
              <div className="flex gap-2">
                <button onClick={() => cambiarEstado(selected.id, "confirmada")}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-xs font-medium py-2 rounded-lg transition-colors">
                  <CheckCircle size={13} /> Confirmar
                </button>
                <button onClick={() => cambiarEstado(selected.id, "rechazada")}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium py-2 rounded-lg transition-colors">
                  <XCircle size={13} /> Rechazar
                </button>
              </div>
            )}

            {selected.estado === "confirmada" && (
              <button onClick={() => cambiarEstado(selected.id, "realizada")}
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-medium py-2 rounded-lg transition-colors">
                <CheckCheck size={13} /> Marcar como realizada
              </button>
            )}

            <div>
              <p className="text-xs font-medium mb-1.5">Estado</p>
              <div className="relative">
                <select value={selected.estado} onChange={e => cambiarEstado(selected.id, e.target.value as EstadoDemo)}
                  className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50">
                  {ESTADOS.filter(e => e.value !== "todos").map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
