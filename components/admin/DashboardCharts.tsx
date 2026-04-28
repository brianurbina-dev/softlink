"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface LeadDay { day: string; leads: number }
interface DemoEstado { estado: string; count: number }

interface Props {
  leadsPorDia: LeadDay[];
  demosPorEstado: DemoEstado[];
}

const ESTADO_COLOR: Record<string, string> = {
  pendiente: "#f59e0b",
  confirmada: "#6c63ff",
  rechazada: "#ef4444",
  realizada: "#10b981",
};

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  rechazada: "Rechazada",
  realizada: "Realizada",
};

export function DashboardCharts({ leadsPorDia, demosPorEstado }: Props) {
  const totalDemos = demosPorEstado.reduce((s, d) => s + d.count, 0);

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      {/* Leads últimos 7 días */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-1">Leads — últimos 7 días</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Total: <span className="font-medium text-foreground">{leadsPorDia.reduce((s, d) => s + d.leads, 0)}</span>
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={leadsPorDia} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              itemStyle={{ color: "#6c63ff" }}
            />
            <Area type="monotone" dataKey="leads" stroke="#6c63ff" strokeWidth={2} fill="url(#leadGradient)" dot={{ r: 3, fill: "#6c63ff" }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Demos por estado */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-1">Demos por estado</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Total: <span className="font-medium text-foreground">{totalDemos}</span>
        </p>
        {totalDemos === 0 ? (
          <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">Sin datos aún</div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={demosPorEstado}
                dataKey="count"
                nameKey="estado"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
              >
                {demosPorEstado.map((d, i) => (
                  <Cell key={i} fill={ESTADO_COLOR[d.estado] ?? "#6c63ff"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(value, name) => [value, ESTADO_LABEL[name as string] ?? name]}
              />
              <Legend
                formatter={(value) => ESTADO_LABEL[value] ?? value}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
