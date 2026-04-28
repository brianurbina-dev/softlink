"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Package, Star, Inbox, CalendarCheck,
  BookOpen, Settings, UserCog, LogOut, ExternalLink,
} from "lucide-react";
import type { Rol } from "@/types";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["super_admin", "editor", "comercial", "viewer"] },
  { href: "/admin/equipo", label: "Equipo", icon: Users, roles: ["super_admin", "editor"] },
  { href: "/admin/productos", label: "Productos", icon: Package, roles: ["super_admin", "editor"] },
  { href: "/admin/testimonios", label: "Testimonios", icon: Star, roles: ["super_admin", "editor"] },
  { href: "/admin/leads", label: "Leads", icon: Inbox, roles: ["super_admin", "comercial"] },
  { href: "/admin/demos", label: "Demos", icon: CalendarCheck, roles: ["super_admin", "comercial"] },
  { href: "/admin/blog", label: "Blog", icon: BookOpen, roles: ["super_admin", "editor"] },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings, roles: ["super_admin"] },
  { href: "/admin/usuarios", label: "Usuarios", icon: UserCog, roles: ["super_admin"] },
] as const;

interface Props { rol: Rol; nombre: string; email: string }

export function Sidebar({ rol, nombre, email }: Props) {
  const pathname = usePathname();

  const links = NAV.filter((n) => (n.roles as readonly string[]).includes(rol));

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-border bg-card shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-14 border-b border-border shrink-0">
        <span className="font-bold text-lg">Soft<span className="text-[#6c63ff]">link</span></span>
        <span className="text-[10px] bg-[#6c63ff]/10 text-[#a78bfa] px-1.5 py-0.5 rounded font-medium ml-auto">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {links.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[#6c63ff]/10 text-[#6c63ff]"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}>
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-3 space-y-1">
        <Link href="/" target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <ExternalLink size={13} />Ver sitio
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
          <LogOut size={13} />Cerrar sesión
        </button>
        <div className="px-3 pt-2 border-t border-border mt-1">
          <p className="text-xs font-medium truncate">{nombre}</p>
          <p className="text-[10px] text-muted-foreground truncate">{email}</p>
          <span className="inline-block mt-1 text-[10px] bg-[#6c63ff]/10 text-[#a78bfa] px-1.5 py-0.5 rounded">
            {rol.replace("_", " ")}
          </span>
        </div>
      </div>
    </aside>
  );
}
