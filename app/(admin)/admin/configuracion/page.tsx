"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";

const CAMPOS: { key: string; label: string; tipo?: "textarea" | "url"; placeholder?: string }[] = [
  { key: "email_contacto", label: "Email de contacto", placeholder: "contacto@softlink.cl" },
  { key: "telefono", label: "Teléfono", placeholder: "+56 9 9999 9999" },
  { key: "whatsapp", label: "WhatsApp (número con código país)", placeholder: "56999999999" },
  { key: "hero_titulo", label: "Título del Hero", tipo: "textarea" },
  { key: "hero_subtitulo", label: "Subtítulo del Hero", tipo: "textarea" },
  { key: "eslogan", label: "Eslogan", placeholder: "Más que tecnología, un compromiso contigo" },
  { key: "linkedin_url", label: "LinkedIn URL", tipo: "url", placeholder: "https://linkedin.com/company/softlink" },
  { key: "github_url", label: "GitHub URL", tipo: "url", placeholder: "https://github.com/softlink" },
  { key: "twitter_url", label: "Twitter/X URL", tipo: "url" },
  { key: "instagram_url", label: "Instagram URL", tipo: "url" },
];

export default function ConfiguracionPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/configuracion").then(r => r.json()).then((d: Record<string, string>) => {
      setValues(d); setOriginal(d); setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await fetch("/api/configuracion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      setOriginal(values); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const isDirty = JSON.stringify(values) !== JSON.stringify(original);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Cargando...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configuración del sitio</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Edita sin tocar código</p>
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <button onClick={load} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw size={13} /> Descartar
            </button>
          )}
          <button onClick={handleSave} disabled={saving || !isDirty}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isDirty ? "bg-[#6c63ff] hover:bg-[#5b52e0] text-white" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
            <Save size={14} /> {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Información de contacto</h2>
        {CAMPOS.slice(0, 3).map(campo => (
          <div key={campo.key} className="space-y-1.5">
            <label className="text-sm font-medium">{campo.label}</label>
            <input value={values[campo.key] || ""} onChange={e => setValues(p => ({ ...p, [campo.key]: e.target.value }))}
              placeholder={campo.placeholder}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Textos del sitio</h2>
        {CAMPOS.slice(3, 6).map(campo => (
          <div key={campo.key} className="space-y-1.5">
            <label className="text-sm font-medium">{campo.label}</label>
            {campo.tipo === "textarea" ? (
              <textarea value={values[campo.key] || ""} onChange={e => setValues(p => ({ ...p, [campo.key]: e.target.value }))} rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 resize-none" />
            ) : (
              <input value={values[campo.key] || ""} onChange={e => setValues(p => ({ ...p, [campo.key]: e.target.value }))}
                placeholder={campo.placeholder}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Redes sociales</h2>
        {CAMPOS.slice(6).map(campo => (
          <div key={campo.key} className="space-y-1.5">
            <label className="text-sm font-medium">{campo.label}</label>
            <input value={values[campo.key] || ""} onChange={e => setValues(p => ({ ...p, [campo.key]: e.target.value }))}
              placeholder={campo.placeholder} type="url"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
