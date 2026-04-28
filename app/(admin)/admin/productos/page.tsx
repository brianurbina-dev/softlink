"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ScreenshotsUpload } from "@/components/admin/ScreenshotsUpload";

type EstadoProducto = "disponible" | "proximamente" | "en_desarrollo";

interface Producto {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  descripcionEn?: string | null;
  descripcionLarga?: string | null;
  descripcionLargaEn?: string | null;
  imagen?: string | null;
  screenshots: string[];
  estado: EstadoProducto;
  demoUrl?: string | null;
  precio?: number | null;
  tipoPrecio?: string | null;
  tecnologias: string[];
  destacado: boolean;
  activo: boolean;
  _count?: { demos: number };
}

type FormData = {
  nombre: string; slug: string; descripcion: string; descripcionEn: string;
  descripcionLarga: string; descripcionLargaEn: string;
  imagen: string; screenshots: string[]; estado: EstadoProducto; demoUrl: string; precio: string;
  tipoPrecio: string; tecnologias: string; destacado: boolean; activo: boolean;
};

const emptyForm: FormData = {
  nombre: "", slug: "", descripcion: "", descripcionEn: "",
  descripcionLarga: "", descripcionLargaEn: "", imagen: "", screenshots: [],
  estado: "proximamente", demoUrl: "", precio: "", tipoPrecio: "",
  tecnologias: "", destacado: false, activo: true,
};

const ESTADO_BADGE: Record<EstadoProducto, string> = {
  disponible: "bg-emerald-500/10 text-emerald-500",
  proximamente: "bg-slate-500/10 text-slate-400",
  en_desarrollo: "bg-amber-500/10 text-amber-500",
};

const ESTADO_LABEL: Record<EstadoProducto, string> = {
  disponible: "Disponible",
  proximamente: "Próximamente",
  en_desarrollo: "En desarrollo",
};

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function ProductosPage() {
  const [items, setItems] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoProducto | "todos">("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/productos?admin=true")
      .then(r => r.json())
      .then((d: Producto[]) => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setModalOpen(true); };

  const openEdit = (item: Producto) => {
    setEditing(item);
    setForm({
      nombre: item.nombre, slug: item.slug, descripcion: item.descripcion,
      descripcionEn: item.descripcionEn || "",
      descripcionLarga: item.descripcionLarga || "",
      descripcionLargaEn: item.descripcionLargaEn || "",
      imagen: item.imagen || "",
      screenshots: item.screenshots ?? [],
      estado: item.estado, demoUrl: item.demoUrl || "",
      precio: item.precio?.toString() || "", tipoPrecio: item.tipoPrecio || "",
      tecnologias: item.tecnologias.join(", "), destacado: item.destacado, activo: item.activo,
    });
    setError(""); setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.nombre || !form.slug || !form.descripcion) { setError("Nombre, slug y descripción son obligatorios."); return; }
    setSaving(true); setError("");
    try {
      const payload = {
        ...form,
        precio: form.precio ? Number(form.precio) : null,
        tecnologias: form.tecnologias.split(",").map(t => t.trim()).filter(Boolean),
        descripcionEn: form.descripcionEn || null,
        descripcionLargaEn: form.descripcionLargaEn || null,
        screenshots: form.screenshots,
      };
      const res = await fetch(editing ? `/api/productos/${editing.id}` : "/api/productos", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Error al guardar"); return; }
      closeModal(); load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/productos/${id}`, { method: "DELETE" });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleActivo = async (item: Producto) => {
    await fetch(`/api/productos/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ activo: !item.activo }) });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, activo: !i.activo } : i));
  };

  const filtrados = items.filter(i =>
    (filtroEstado === "todos" || i.estado === filtroEstado) &&
    (i.nombre.toLowerCase().includes(busqueda.toLowerCase()) || i.slug.includes(busqueda.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} productos</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Nuevo producto
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["todos", "disponible", "proximamente", "en_desarrollo"] as const).map(e => (
            <button key={e} onClick={() => setFiltroEstado(e)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filtroEstado === e ? "bg-[#6c63ff] text-white" : "border border-border hover:bg-accent"}`}>
              {e === "todos" ? "Todos" : ESTADO_LABEL[e]}
            </button>
          ))}
        </div>
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
                {["Producto", "Estado", "Demos", "Dest.", "Activo", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(item => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#6c63ff]/10 overflow-hidden flex items-center justify-center shrink-0">
                        {item.imagen ? <Image src={item.imagen} alt={item.nombre} width={36} height={36} className="object-cover w-full h-full" />
                          : <span className="text-[#6c63ff] font-bold text-sm">{item.nombre[0]}</span>}
                      </div>
                      <div>
                        <p className="font-medium">{item.nombre}</p>
                        <p className="text-xs text-muted-foreground font-mono">/{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_BADGE[item.estado]}`}>{ESTADO_LABEL[item.estado]}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item._count?.demos ?? 0}</td>
                  <td className="px-4 py-3">{item.destacado && <Star size={14} className="text-amber-500 fill-amber-500" />}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActivo(item)} className={`w-9 h-5 rounded-full transition-colors relative ${item.activo ? "bg-emerald-500" : "bg-muted"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${item.activo ? "left-4" : "left-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      {item.demoUrl && (
                        <a href={item.demoUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
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
              <h2 className="font-semibold text-lg">{editing ? "Editar producto" : "Nuevo producto"}</h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Nombre *</label>
                <input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value, slug: editing ? p.slug : slugify(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Slug *</label>
                <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 font-mono" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Descripción corta *</label>
              <textarea value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Descripción larga</label>
              <textarea value={form.descripcionLarga} onChange={e => setForm(p => ({ ...p, descripcionLarga: e.target.value }))} rows={4}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none" />
            </div>

            {/* EN translations */}
            <div className="border-t border-border pt-4 space-y-4">
              <p className="text-xs font-semibold text-[#6c63ff] uppercase tracking-wider flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#6c63ff]/10 font-mono">EN</span>
                Traducción al inglés (opcional)
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Short description</label>
                <textarea value={form.descripcionEn} onChange={e => setForm(p => ({ ...p, descripcionEn: e.target.value }))} rows={2}
                  placeholder="English short description..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Long description</label>
                <textarea value={form.descripcionLargaEn} onChange={e => setForm(p => ({ ...p, descripcionLargaEn: e.target.value }))} rows={4}
                  placeholder="English long description..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Imagen principal</label>
              <ImageUpload value={form.imagen} onChange={url => setForm(p => ({ ...p, imagen: url }))} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Screenshots <span className="text-muted-foreground font-normal">(máx. 6)</span></label>
              <ScreenshotsUpload value={form.screenshots} onChange={urls => setForm(p => ({ ...p, screenshots: urls }))} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Estado</label>
              <select value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value as EstadoProducto }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50">
                <option value="proximamente">Próximamente</option>
                <option value="en_desarrollo">En desarrollo</option>
                <option value="disponible">Disponible</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">URL demo</label>
                <input value={form.demoUrl} onChange={e => setForm(p => ({ ...p, demoUrl: e.target.value }))} placeholder="https://..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Precio (CLP)</label>
                <input type="number" value={form.precio} onChange={e => setForm(p => ({ ...p, precio: e.target.value }))} placeholder="29990"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Tipo precio</label>
                <input value={form.tipoPrecio} onChange={e => setForm(p => ({ ...p, tipoPrecio: e.target.value }))} placeholder="mensual"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Tecnologías (separadas por coma)</label>
              <input value={form.tecnologias} onChange={e => setForm(p => ({ ...p, tecnologias: e.target.value }))} placeholder="Next.js, PostgreSQL, Redis..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.destacado} onChange={e => setForm(p => ({ ...p, destacado: e.target.checked }))} className="accent-[#6c63ff]" />
                Destacado
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.activo} onChange={e => setForm(p => ({ ...p, activo: e.target.checked }))} className="accent-[#6c63ff]" />
                Activo
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium bg-[#6c63ff] hover:bg-[#5b52e0] text-white rounded-lg transition-colors disabled:opacity-50">
                {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
