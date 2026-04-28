# Softlink — Sitio corporativo

Sitio web corporativo de Softlink SpA con panel de administración. Construido con Next.js 16, Prisma 7, Supabase PostgreSQL, NextAuth v5, Resend y Tailwind CSS v4.

---

## Requisitos

- Node.js 20+
- PostgreSQL (vía Supabase o instancia propia)
- Cuenta en [Resend](https://resend.com) (opcional, para emails)
- Cuenta en [Upstash](https://upstash.com) (opcional, para rate limiting)

---

## Instalación local

```bash
# 1. Clonar y entrar al proyecto
git clone <repo-url>
cd softlink

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Aplicar el esquema a la base de datos
npx prisma db push

# 5. Poblar con datos de prueba
npm run seed

# 6. Levantar el servidor de desarrollo
npm run dev
```

El sitio estará disponible en [http://localhost:3000](http://localhost:3000).  
El panel admin en [http://localhost:3000/admin](http://localhost:3000/admin).

**Credenciales por defecto (seed):** `admin@softlink.cl` / `admin123`

---

## Variables de entorno

Crea `.env.local` con las siguientes variables:

```env
# Base de datos (Supabase o PostgreSQL propio)
DATABASE_URL=postgresql://usuario:password@host:5432/softlink

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<genera con: openssl rand -base64 32>

# URL pública del sitio (para sitemap y emails)
NEXT_PUBLIC_SITE_URL=https://softlink.cl

# Supabase (solo si usas Storage de Supabase)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend — emails transaccionales (opcional)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=contacto@softlink.cl
EMAIL_TO=equipo@softlink.cl

# Uploadthing — subida de imágenes (opcional)
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Upstash Redis — rate limiting (opcional)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

> Las variables marcadas como opcionales permiten que el sistema funcione sin ellas (emails y rate limiting se desactivan automáticamente cuando no están configuradas).

---

## Estructura del proyecto

```
softlink/
├── app/
│   ├── (public)/          # Sitio público
│   │   ├── page.tsx       # Landing page
│   │   ├── blog/          # Blog (listado + artículo individual)
│   │   └── productos/     # Detalle de producto
│   ├── (admin)/           # Panel de administración
│   │   ├── admin/         # Secciones del panel
│   │   └── login/
│   ├── api/               # API Routes
│   ├── not-found.tsx      # Página 404
│   ├── sitemap.ts         # Sitemap dinámico
│   └── robots.ts          # robots.txt
├── components/
│   ├── public/            # Componentes del sitio público
│   └── admin/             # Componentes del panel
├── lib/                   # Utilidades (prisma, auth, emails, etc.)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── proxy.ts               # Middleware de autenticación (Next.js 16)
```

---

## Base de datos

El proyecto usa **Prisma 7** con el adaptador `@prisma/adapter-pg`.

```bash
# Aplicar cambios del schema
npx prisma db push

# Abrir Prisma Studio
npx prisma studio

# Resetear y re-sembrar
npx prisma db push --force-reset && npm run seed
```

---

## Deploy en Vercel

1. Importar el repositorio en [vercel.com](https://vercel.com)
2. Configurar todas las variables de entorno en el dashboard de Vercel
3. Asegurarse de que `NEXTAUTH_URL` apunta al dominio de producción
4. El deploy es automático en cada push a `main`

```bash
# Build local de verificación
npm run build
```

---

## Roles del panel admin

| Rol | Descripción |
|---|---|
| `super_admin` | Acceso total, gestión de usuarios y configuración |
| `editor` | Puede gestionar equipo, productos, testimonios y blog |
| `comercial` | Puede ver y gestionar leads y demos |
| `viewer` | Solo acceso al dashboard (solo lectura) |

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Lenguaje | TypeScript 5 estricto |
| UI | Tailwind CSS v4 + shadcn/ui (Base UI) |
| Animaciones | Framer Motion 12 |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Base de datos | PostgreSQL via Supabase |
| Auth | NextAuth.js v5 (beta) |
| Emails | Resend |
| Imágenes | Uploadthing |
| Rate limiting | Upstash Redis |
| Deploy | Vercel |

---

*Softlink SpA · Santiago, Chile · 2025*
