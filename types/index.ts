export type Rol = "super_admin" | "editor" | "comercial" | "viewer";
export type EstadoProducto = "disponible" | "proximamente" | "en_desarrollo";
export type EstadoLead = "nuevo" | "en_contacto" | "cerrado" | "descartado";
export type EstadoDemo = "pendiente" | "confirmada" | "rechazada" | "realizada";

export interface NavItem {
  label: string;
  href: string;
}

export interface PrecioFeature {
  texto: string;
  incluido: boolean;
}

export interface PlanPrecio {
  nombre: string;
  precio: number;
  precioAnual: number;
  descripcion: string;
  features: PrecioFeature[];
  destacado: boolean;
  cta: string;
}
