"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, ShieldCheck } from "lucide-react";

type Rol = "super_admin" | "editor" | "comercial" | "viewer";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  creadoEn: string;
}

type FormData = { nombre: string; email: string; password: string; rol: Rol; activo: boolean };

const emptyForm: FormData = { nombre: "", email: "", password: "", rol: "viewer", activo: true };

const ROL_BADGE: Record<Rol, string> = {
  super_admin: "bg-[#6c63ff]/10 text-[#6c63ff]",
  editor: "bg-blue-500/10 text-blue-500",
  comercial: "bg-amber-500/10 text-amber-500",
  viewer: "bg-muted text-muted-foreground",
};

const ROL_LABEL: Record<Rol, string> = {
  super_admin: "Super Admin",
  editor: "Editor",
  comercial: "Comercial",
  viewer: "Viewer",
};

export default function UsuariosPage() {
  const [items, setItems] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/usuarios").then(r => r.json()).then((d: Usuario[]) => { setItems(d); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setModalOpen(true); };

  const openEdit = (item: Usuario) => {
    setEditing(item);
    setForm({ nombre: item.nombre, email: item.email, password: "", rol: item.rol, activo: item.activo });
    setError(""); setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.nombre || !form.email) { setError("Nombre y email son obligatorios."); return; }
    if (!editing && !form.password) { setError("La contraseña es obligatoria al crear."); return; }
    setSaving(true); setError("");
    try {
      const payload = { ...form, ...(editing && !form.password ? { password: undefined } : {}) };
      const res = await fetch(editing ? `/api/usuarios/${editing.id}` : "/api/usuarios", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Error al guardar"); return; }
      closeModal(); load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error || "Error al eliminar"); return; }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleActivo = async (item: Usuario) => {
    await fetch(`/api/usuarios/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ activo: !item.activo }) });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, activo: !i.activo } : i));
  };

  const filtrados = items.filter(i =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase()) || i.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} usuarios admin</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Nuevo usuario
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? <div className="p-8 text-center text-sm text-muted-foreground">Cargando...</div>
          : filtrados.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">Sin usuarios</div>
          : (
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left">
                  {["Usuario", "Email", "Rol", "Activo", "Desde", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(item => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#6c63ff]/10 flex items-center justify-center text-[#6c63ff] font-semibold text-xs shrink-0">
                          {item.nombre[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{item.nombre}</span>
                        {item.rol === "super_admin" && <ShieldCheck size={13} className="text-[#6c63ff]" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ROL_BADGE[item.rol]}`}>{ROL_LABEL[item.rol]}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActivo(item)} className={`w-9 h-5 rounded-full transition-colors relative ${item.activo ? "bg-emerald-500" : "bg-muted"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${item.activo ? "left-4" : "left-0.5"}`} />
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
          <div className="bg-card w-full max-w-md rounded-xl border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{editing ? "Editar usuario" : "Nuevo usuario"}</h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Nombre *</label>
              <input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">{editing ? "Nueva contraseña (dejar vacío para mantener)" : "Contraseña *"}</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} autoComplete="new-password"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Rol</label>
              <select value={form.rol} onChange={e => setForm(p => ({ ...p, rol: e.target.value as Rol }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50">
                <option value="viewer">Viewer</option>
                <option value="comercial">Comercial</option>
                <option value="editor">Editor</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.activo} onChange={e => setForm(p => ({ ...p, activo: e.target.checked }))} className="accent-[#6c63ff]" />
              Activo
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium bg-[#6c63ff] hover:bg-[#5b52e0] text-white rounded-lg transition-colors disabled:opacity-50">
                {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
