"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Star, User } from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "@/components/admin/ImageUpload";

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
  orden: number;
  activo: boolean;
}

type FormData = {
  nombre: string; cargo: string; cargoEn: string; empresa: string;
  foto: string; texto: string; textoEn: string; estrellas: number; orden: number; activo: boolean;
};

const emptyForm: FormData = { nombre: "", cargo: "", cargoEn: "", empresa: "", foto: "", texto: "", textoEn: "", estrellas: 5, orden: 0, activo: true };

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= n ? "text-amber-400 fill-amber-400" : "text-muted"} />)}
    </div>
  );
}

export default function TestimoniosPage() {
  const [items, setItems] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonio | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/testimonios?admin=true")
      .then(r => r.json())
      .then((d: Testimonio[]) => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setModalOpen(true); };

  const openEdit = (item: Testimonio) => {
    setEditing(item);
    setForm({ nombre: item.nombre, cargo: item.cargo, cargoEn: item.cargoEn || "", empresa: item.empresa, foto: item.foto || "", texto: item.texto, textoEn: item.textoEn || "", estrellas: item.estrellas, orden: item.orden, activo: item.activo });
    setError(""); setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.nombre || !form.cargo || !form.empresa || !form.texto) { setError("Nombre, cargo, empresa y texto son obligatorios."); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch(editing ? `/api/testimonios/${editing.id}` : "/api/testimonios", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Error al guardar"); return; }
      closeModal(); load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este testimonio?")) return;
    await fetch(`/api/testimonios/${id}`, { method: "DELETE" });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleActivo = async (item: Testimonio) => {
    await fetch(`/api/testimonios/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ activo: !item.activo }) });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, activo: !i.activo } : i));
  };

  const filtrados = items.filter(i =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.empresa.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonios</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} testimonios</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Nuevo testimonio
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
                {["Persona", "Empresa", "Estrellas", "Orden", "Activo", ""].map(h => (
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
                        {item.foto ? <Image src={item.foto} alt={item.nombre} width={32} height={32} className="object-cover w-full h-full" />
                          : <User size={14} className="text-[#6c63ff]" />}
                      </div>
                      <div>
                        <p className="font-medium">{item.nombre}</p>
                        <p className="text-xs text-muted-foreground">{item.cargo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.empresa}</td>
                  <td className="px-4 py-3"><Stars n={item.estrellas} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{item.orden}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActivo(item)} className={`w-9 h-5 rounded-full transition-colors relative ${item.activo ? "bg-emerald-500" : "bg-muted"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${item.activo ? "left-4" : "left-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="bg-card w-full max-w-lg rounded-xl border border-border p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{editing ? "Editar testimonio" : "Nuevo testimonio"}</h2>
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
              <label className="text-xs font-medium">Empresa *</label>
              <input value={form.empresa} onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Foto</label>
              <ImageUpload value={form.foto || ""} onChange={url => setForm(p => ({ ...p, foto: url }))} aspectRatio="square" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Testimonio *</label>
              <textarea value={form.texto} onChange={e => setForm(p => ({ ...p, texto: e.target.value }))} rows={4}
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
                <input value={form.cargoEn} onChange={e => setForm(p => ({ ...p, cargoEn: e.target.value }))} placeholder="e.g. CEO, Acme Corp"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Testimonial</label>
                <textarea value={form.textoEn} onChange={e => setForm(p => ({ ...p, textoEn: e.target.value }))} rows={4}
                  placeholder="English testimonial text..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Estrellas</label>
                <div className="flex gap-2 items-center h-[38px]">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(p => ({ ...p, estrellas: n }))}>
                      <Star size={20} className={n <= form.estrellas ? "text-amber-400 fill-amber-400" : "text-muted-foreground"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Orden</label>
                <input type="number" value={form.orden} onChange={e => setForm(p => ({ ...p, orden: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.activo} onChange={e => setForm(p => ({ ...p, activo: e.target.checked }))} className="accent-[#6c63ff]" />
              Activo
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium bg-[#6c63ff] hover:bg-[#5b52e0] text-white rounded-lg transition-colors disabled:opacity-50">
                {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear testimonio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
