"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, ExternalLink, User } from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "@/components/admin/ImageUpload";

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
  orden: number;
  activo: boolean;
  creadoEn: string;
}

type FormData = Omit<Integrante, "id" | "creadoEn">;

const empty: FormData = { nombre: "", cargo: "", cargoEn: "", descripcion: "", descripcionEn: "", foto: "", linkedin: "", github: "", orden: 0, activo: true };

export default function EquipoPage() {
  const [items, setItems] = useState<Integrante[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Integrante | null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/equipo")
      .then(r => r.json())
      .then((d: Integrante[]) => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item: Integrante) => {
    setEditing(item);
    setForm({
      nombre: item.nombre,
      cargo: item.cargo,
      cargoEn: item.cargoEn || "",
      descripcion: item.descripcion,
      descripcionEn: item.descripcionEn || "",
      foto: item.foto || "",
      linkedin: item.linkedin || "",
      github: item.github || "",
      orden: item.orden,
      activo: item.activo,
    });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.nombre || !form.cargo || !form.descripcion) {
      setError("Nombre, cargo y descripción son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = editing ? `/api/equipo/${editing.id}` : "/api/equipo";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Error al guardar"); return; }
      closeModal();
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este integrante?")) return;
    await fetch(`/api/equipo/${id}`, { method: "DELETE" });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleActivo = async (item: Integrante) => {
    await fetch(`/api/equipo/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !item.activo }),
    });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, activo: !i.activo } : i));
  };

  const filtrados = items.filter(i =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.cargo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Equipo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} integrantes</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Nuevo integrante
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Cargando...</div>
        ) : filtrados.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Sin resultados</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left">
                {["Integrante", "Cargo", "Orden", "Links", "Activo", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(item => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#6c63ff]/10 overflow-hidden flex items-center justify-center shrink-0">
                        {item.foto ? (
                          <Image src={item.foto} alt={item.nombre} width={32} height={32} className="object-cover w-full h-full" />
                        ) : (
                          <User size={14} className="text-[#6c63ff]" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium leading-tight">{item.nombre}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">{item.descripcion}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.cargo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.orden}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {item.linkedin && (
                        <a href={item.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {item.github && (
                        <a href={item.github} target="_blank" rel="noreferrer" title="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActivo(item)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${item.activo ? "bg-emerald-500" : "bg-muted"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${item.activo ? "left-4" : "left-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="bg-card w-full max-w-lg rounded-xl border border-border p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{editing ? "Editar integrante" : "Nuevo integrante"}</h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Nombre *</label>
                <input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Cargo *</label>
                <input value={form.cargo} onChange={e => setForm(p => ({ ...p, cargo: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Descripción *</label>
              <textarea value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none" />
            </div>

            {/* EN translations */}
            <div className="border-t border-border pt-4 space-y-4">
              <p className="text-xs font-semibold text-[#6c63ff] uppercase tracking-wider flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#6c63ff]/10 font-mono">EN</span>
                Traducción al inglés (opcional)
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Job title</label>
                <input value={form.cargoEn || ""} onChange={e => setForm(p => ({ ...p, cargoEn: e.target.value }))} placeholder="e.g. Co-founder & CTO"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Bio</label>
                <textarea value={form.descripcionEn || ""} onChange={e => setForm(p => ({ ...p, descripcionEn: e.target.value }))} rows={3}
                  placeholder="English bio..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Foto</label>
              <ImageUpload value={form.foto || ""} onChange={url => setForm(p => ({ ...p, foto: url }))} aspectRatio="square" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">LinkedIn</label>
                <input value={form.linkedin || ""} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">GitHub</label>
                <input value={form.github || ""} onChange={e => setForm(p => ({ ...p, github: e.target.value }))} placeholder="https://github.com/..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Orden</label>
                <input type="number" value={form.orden} onChange={e => setForm(p => ({ ...p, orden: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Estado</label>
                <div className="flex items-center gap-3 h-[38px]">
                  <button onClick={() => setForm(p => ({ ...p, activo: !p.activo }))}
                    className={`w-9 h-5 rounded-full transition-colors relative ${form.activo ? "bg-emerald-500" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.activo ? "left-4" : "left-0.5"}`} />
                  </button>
                  <span className="text-sm text-muted-foreground">{form.activo ? "Activo" : "Inactivo"}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 text-sm font-medium bg-[#6c63ff] hover:bg-[#5b52e0] text-white rounded-lg transition-colors disabled:opacity-50">
                {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear integrante"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
