"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Download, X } from "lucide-react";

type EstadoLead = "nuevo" | "en_contacto" | "cerrado" | "descartado";

interface Lead {
  id: string; nombre: string; email: string; empresa?: string | null;
  mensaje: string; estado: EstadoLead; creadoEn: string; notas?: string | null;
}

const ESTADOS: { value: EstadoLead | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "nuevo", label: "Nuevo" },
  { value: "en_contacto", label: "En contacto" },
  { value: "cerrado", label: "Cerrado" },
  { value: "descartado", label: "Descartado" },
];

const BADGE: Record<EstadoLead, string> = {
  nuevo: "bg-blue-500/10 text-blue-500",
  en_contacto: "bg-amber-500/10 text-amber-500",
  cerrado: "bg-emerald-500/10 text-emerald-500",
  descartado: "bg-muted text-muted-foreground",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtro, setFiltro] = useState<EstadoLead | "todos">("todos");
  const [busqueda, setBusqueda] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);

  useEffect(() => {
    fetch("/api/leads").then(r => r.json()).then(d => { setLeads(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtrados = leads.filter(l =>
    (filtro === "todos" || l.estado === filtro) &&
    (l.nombre.toLowerCase().includes(busqueda.toLowerCase()) || l.email.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const actualizarEstado = async (id: string, estado: EstadoLead) => {
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estado }) });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, estado } : l));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, estado } : null);
  };

  const exportCSV = () => {
    const headers = ["Nombre", "Email", "Empresa", "Estado", "Fecha", "Mensaje"];
    const rows = filtrados.map(l => [
      l.nombre,
      l.email,
      l.empresa ?? "",
      l.estado.replace("_", " "),
      new Date(l.creadoEn).toLocaleDateString("es-CL"),
      `"${l.mensaje.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (checkedIds.size === filtrados.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(filtrados.map(l => l.id)));
    }
  };

  const bulkCambiarEstado = async (estado: EstadoLead) => {
    setBulkSaving(true);
    await Promise.all([...checkedIds].map(id =>
      fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estado }) })
    ));
    setLeads(prev => prev.map(l => checkedIds.has(l.id) ? { ...l, estado } : l));
    if (selected && checkedIds.has(selected.id)) setSelected(prev => prev ? { ...prev, estado } : null);
    setCheckedIds(new Set());
    setBulkSaving(false);
  };

  const allChecked = filtrados.length > 0 && checkedIds.size === filtrados.length;
  const someChecked = checkedIds.size > 0;

  return (
    <div className="space-y-5 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{leads.length} contactos recibidos</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 text-sm border border-border rounded-lg px-3 py-2 hover:bg-accent transition-colors">
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por nombre o email..."
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

      {/* Bulk action bar */}
      {someChecked && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#6c63ff]/10 border border-[#6c63ff]/20">
          <span className="text-sm font-medium text-[#6c63ff]">{checkedIds.size} seleccionados</span>
          <span className="text-muted-foreground">—</span>
          <span className="text-xs text-muted-foreground">Cambiar a:</span>
          <div className="flex gap-1.5 flex-wrap">
            {ESTADOS.filter(e => e.value !== "todos").map(e => (
              <button key={e.value} disabled={bulkSaving} onClick={() => bulkCambiarEstado(e.value as EstadoLead)}
                className="px-2.5 py-1 rounded-md text-xs font-medium border border-border hover:bg-accent transition-colors disabled:opacity-50">
                {e.label}
              </button>
            ))}
          </div>
          <button onClick={() => setCheckedIds(new Set())} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Table + detail */}
      <div className="flex gap-5 min-h-0" style={{ height: "calc(100vh - 260px)" }}>
        <div className="flex-1 overflow-auto rounded-xl border border-border bg-card">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Cargando...</div>
          ) : filtrados.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Sin resultados</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="px-4 py-3">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-[#6c63ff] cursor-pointer" />
                  </th>
                  {["Nombre", "Email", "Empresa", "Estado", "Fecha"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(lead => (
                  <tr key={lead.id}
                    className={`border-b border-border hover:bg-accent/50 transition-colors ${selected?.id === lead.id ? "bg-[#6c63ff]/5" : ""}`}>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={checkedIds.has(lead.id)} onChange={() => toggleCheck(lead.id)} className="accent-[#6c63ff] cursor-pointer" />
                    </td>
                    <td className="px-4 py-3 font-medium cursor-pointer" onClick={() => setSelected(lead)}>{lead.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground cursor-pointer" onClick={() => setSelected(lead)}>{lead.email}</td>
                    <td className="px-4 py-3 text-muted-foreground cursor-pointer" onClick={() => setSelected(lead)}>{lead.empresa ?? "—"}</td>
                    <td className="px-4 py-3 cursor-pointer" onClick={() => setSelected(lead)}>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${BADGE[lead.estado]}`}>
                        {lead.estado.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs cursor-pointer" onClick={() => setSelected(lead)}>
                      {new Date(lead.creadoEn).toLocaleDateString("es-CL")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
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
            <div>
              <p className="text-xs font-medium mb-1">Mensaje</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{selected.mensaje}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1.5">Estado</p>
              <div className="relative">
                <select value={selected.estado} onChange={e => actualizarEstado(selected.id, e.target.value as EstadoLead)}
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
