"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Articulo {
  id: string;
  slug: string;
  titulo: string;
  tituloEn?: string | null;
  resumen: string;
  resumenEn?: string | null;
  contenido?: string;
  contenidoEn?: string | null;
  imagen?: string | null;
  tags: string[];
  publicado: boolean;
  publicadoEn?: string | null;
  creadoEn: string;
}

type Tab = "es" | "en";

type FormData = {
  titulo: string; tituloEn: string; slug: string;
  resumen: string; resumenEn: string;
  contenido: string; contenidoEn: string;
  imagen: string; tags: string;
  publicado: boolean; publicadoEn: string;
};

const emptyForm: FormData = { titulo: "", tituloEn: "", slug: "", resumen: "", resumenEn: "", contenido: "", contenidoEn: "", imagen: "", tags: "", publicado: false, publicadoEn: "" };

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BlogPage() {
  const [items, setItems] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Articulo | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [tab, setTab] = useState<Tab>("es");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/blog?admin=true").then(r => r.json()).then((d: Articulo[]) => { setItems(d); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setTab("es"); setError(""); setModalOpen(true); };

  const openEdit = async (item: Articulo) => {
    const res = await fetch(`/api/blog/${item.id}?full=true`);
    const full: Articulo = res.ok ? await res.json() : item;
    setEditing(full);
    setForm({
      titulo: full.titulo, tituloEn: full.tituloEn || "", slug: full.slug,
      resumen: full.resumen, resumenEn: full.resumenEn || "",
      contenido: full.contenido || "", contenidoEn: full.contenidoEn || "",
      imagen: full.imagen || "", tags: full.tags.join(", "),
      publicado: full.publicado, publicadoEn: full.publicadoEn ? full.publicadoEn.slice(0, 10) : "",
    });
    setTab("es"); setError(""); setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.titulo || !form.slug || !form.resumen || !form.contenido) { setError("Título, slug, resumen y contenido (ES) son obligatorios."); return; }
    setSaving(true); setError("");
    try {
      const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), publicadoEn: form.publicadoEn || null };
      const res = await fetch(editing ? `/api/blog/${editing.id}` : "/api/blog", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Error al guardar"); return; }
      closeModal(); load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este artículo?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const togglePublicado = async (item: Articulo) => {
    await fetch(`/api/blog/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicado: !item.publicado }) });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, publicado: !i.publicado } : i));
  };

  const filtrados = items.filter(i => i.titulo.toLowerCase().includes(busqueda.toLowerCase()) || i.tags.some(t => t.toLowerCase().includes(busqueda.toLowerCase())));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} artículos</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Nuevo artículo
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? <div className="p-8 text-center text-sm text-muted-foreground">Cargando...</div>
          : filtrados.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">Sin artículos</div>
          : (
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left">
                  {["Título", "Tags", "Publicado", "Fecha", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(item => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.titulo}</p>
                      <p className="text-xs text-muted-foreground font-mono">/{item.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {item.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#6c63ff]/10 text-[#6c63ff]">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublicado(item)} className={`flex items-center gap-1.5 text-xs font-medium ${item.publicado ? "text-emerald-500" : "text-muted-foreground"}`}>
                        {item.publicado ? <Eye size={13} /> : <EyeOff size={13} />}
                        {item.publicado ? "Publicado" : "Borrador"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(item.creadoEn).toLocaleDateString("es-CL")}</td>
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
          <div className="bg-card w-full max-w-2xl rounded-xl border border-border p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{editing ? "Editar artículo" : "Nuevo artículo"}</h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

            {/* Language tabs */}
            <div className="flex gap-1 border border-border rounded-lg p-1 w-fit">
              {(["es", "en"] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === t ? "bg-[#6c63ff] text-white" : "hover:bg-accent"}`}>
                  {t === "es" ? "Español" : "English"}
                </button>
              ))}
            </div>

            {tab === "es" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Título *</label>
                    <input value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value, slug: editing ? p.slug : slugify(e.target.value) }))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Slug *</label>
                    <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 font-mono" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Resumen *</label>
                  <textarea value={form.resumen} onChange={e => setForm(p => ({ ...p, resumen: e.target.value }))} rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Contenido (Markdown) *</label>
                  <textarea value={form.contenido} onChange={e => setForm(p => ({ ...p, contenido: e.target.value }))} rows={10}
                    placeholder="# Título&#10;&#10;Contenido en Markdown..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none font-mono" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Title (EN)</label>
                  <input value={form.tituloEn} onChange={e => setForm(p => ({ ...p, tituloEn: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Summary (EN)</label>
                  <textarea value={form.resumenEn} onChange={e => setForm(p => ({ ...p, resumenEn: e.target.value }))} rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Content (Markdown EN)</label>
                  <textarea value={form.contenidoEn} onChange={e => setForm(p => ({ ...p, contenidoEn: e.target.value }))} rows={10}
                    placeholder="# Title&#10;&#10;Content in Markdown..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none font-mono" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Imagen destacada</label>
              <ImageUpload value={form.imagen} onChange={url => setForm(p => ({ ...p, imagen: url }))} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Tags (separados por coma)</label>
              <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="Next.js, SaaS, Chile..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
            </div>

            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.publicado} onChange={e => setForm(p => ({ ...p, publicado: e.target.checked }))} className="accent-[#6c63ff]" />
                Publicado
              </label>
              <div className="space-y-1">
                <label className="text-xs font-medium">Fecha de publicación</label>
                <input type="date" value={form.publicadoEn} onChange={e => setForm(p => ({ ...p, publicadoEn: e.target.value }))}
                  className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium bg-[#6c63ff] hover:bg-[#5b52e0] text-white rounded-lg transition-colors disabled:opacity-50">
                {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear artículo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
