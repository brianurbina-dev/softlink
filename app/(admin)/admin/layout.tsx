import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import type { Rol } from "@/types";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as { name?: string | null; email?: string | null; rol?: Rol };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        rol={user.rol ?? "viewer"}
        nombre={user.name ?? "Usuario"}
        email={user.email ?? ""}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
