export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Inbox, CalendarCheck, Package, TrendingUp } from "lucide-react";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

interface LeadRow { id: string; nombre: string; email: string; estado: string }
interface DemoRow { id: string; nombre: string; estado: string; producto: { nombre: string } }
interface Stats {
  totalLeads: number; leadsHoy: number; demosPendientes: number; productosActivos: number;
  ultimosLeads: LeadRow[]; ultimasDemos: DemoRow[];
  leadsPorDia: { day: string; leads: number }[];
  demosPorEstado: { estado: string; count: number }[];
}

async function getStats(): Promise<Stats> {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [totalLeads, leadsHoy, demosPendientes, productosActivos, ultimosLeads, ultimasDemos, leadsRecientes, demosPorEstadoRaw] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { creadoEn: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      prisma.solicitudDemo.count({ where: { estado: "pendiente" } }),
      prisma.producto.count({ where: { activo: true } }),
      prisma.lead.findMany({ orderBy: { creadoEn: "desc" }, take: 5, select: { id: true, nombre: true, email: true, estado: true } }),
      prisma.solicitudDemo.findMany({ orderBy: { creadoEn: "desc" }, take: 5, select: { id: true, nombre: true, estado: true, producto: { select: { nombre: true } } } }),
      prisma.lead.findMany({ where: { creadoEn: { gte: sevenDaysAgo } }, select: { creadoEn: true } }),
      prisma.solicitudDemo.groupBy({ by: ["estado"], _count: { estado: true } }),
    ]);

    const recientes = leadsRecientes as { creadoEn: Date }[];
    const days: { day: string; leads: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      days.push({
        day: d.toLocaleDateString("es-CL", { weekday: "short", day: "numeric" }),
        leads: recientes.filter(l => l.creadoEn >= d && l.creadoEn < next).length,
      });
    }

    const demosPorEstado = demosPorEstadoRaw.map(d => ({ estado: d.estado, count: d._count.estado }));

    return { totalLeads, leadsHoy, demosPendientes, productosActivos, ultimosLeads, ultimasDemos, leadsPorDia: days, demosPorEstado };
  } catch {
    return { totalLeads: 0, leadsHoy: 0, demosPendientes: 0, productosActivos: 0, ultimosLeads: [], ultimasDemos: [], leadsPorDia: [], demosPorEstado: [] };
  }
}

const ESTADO_LEAD: Record<string, string> = {
  nuevo: "bg-blue-500/10 text-blue-500",
  en_contacto: "bg-amber-500/10 text-amber-500",
  cerrado: "bg-emerald-500/10 text-emerald-500",
  descartado: "bg-muted text-muted-foreground",
};

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Leads totales", value: stats.totalLeads, icon: TrendingUp, color: "text-[#6c63ff]" },
    { label: "Leads hoy", value: stats.leadsHoy, icon: Inbox, color: "text-emerald-500" },
    { label: "Demos pendientes", value: stats.demosPendientes, icon: CalendarCheck, color: "text-amber-500" },
    { label: "Productos activos", value: stats.productosActivos, icon: Package, color: "text-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen general de actividad</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <c.icon size={16} className={c.color} />
            </div>
            <p className="text-2xl font-bold tabular-nums">{c.value}</p>
          </div>
        ))}
      </div>

      <DashboardCharts leadsPorDia={stats.leadsPorDia} demosPorEstado={stats.demosPorEstado} />

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Últimos leads</h2>
          {stats.ultimosLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin leads aún</p>
          ) : (
            <div className="space-y-3">
              {stats.ultimosLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{lead.nombre}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_LEAD[lead.estado] ?? ""}`}>
                    {lead.estado.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Últimas demos solicitadas</h2>
          {stats.ultimasDemos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin demos aún</p>
          ) : (
            <div className="space-y-3">
              {stats.ultimasDemos.map((demo) => (
                <div key={demo.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{demo.nombre}</p>
                    <p className="text-xs text-muted-foreground">{demo.producto.nombre}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                    {demo.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
