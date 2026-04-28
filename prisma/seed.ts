import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Super admin
  const hash = await bcrypt.hash("admin123", 12);
  await prisma.usuario.upsert({
    where: { email: "admin@softlink.cl" },
    update: {},
    create: { nombre: "Admin Softlink", email: "admin@softlink.cl", password: hash, rol: "super_admin", activo: true },
  });

  // Integrantes
  await prisma.integrante.deleteMany();
  await prisma.integrante.createMany({
    data: [
      {
        nombre: "Roberto Urbina",
        cargo: "Co-Fundador & CEO",
        descripcion: "Ingeniero civil en computación con 15+ años de experiencia en desarrollo de software empresarial y transformación digital para PYMEs.",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        orden: 1,
        activo: true,
      },
      {
        nombre: "Brian Urbina",
        cargo: "Co-Fundador & CTO",
        descripcion: "Ingeniero de software especializado en arquitecturas cloud, sistemas distribuidos y productos SaaS escalables para el mercado latinoamericano.",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        orden: 2,
        activo: true,
      },
    ],
  });

  // Productos
  await prisma.producto.deleteMany();
  await prisma.producto.createMany({
    data: [
      {
        slug: "softpos",
        nombre: "SoftPOS",
        descripcion: "Sistema de punto de venta moderno para negocios. Gestiona ventas, inventario y reportes en tiempo real desde cualquier dispositivo.",
        descripcionLarga: "SoftPOS es la solución definitiva para negocios chilenos que quieren modernizar su punto de venta. Con soporte para múltiples métodos de pago, control de inventario en tiempo real, reportes automáticos y acceso desde cualquier dispositivo, SoftPOS te permite enfocarte en lo que importa: tu negocio.",
        tecnologias: ["Next.js", "PostgreSQL", "Redis", "PWA"],
        estado: "disponible",
        precio: 29990,
        tipoPrecio: "mensual",
        destacado: true,
        activo: true,
      },
      {
        slug: "softanalytics",
        nombre: "SoftAnalytics",
        descripcion: "Dashboard de métricas e inteligencia de negocio para PYMEs. Visualiza tus datos y toma decisiones basadas en información real.",
        tecnologias: ["React", "Python", "PostgreSQL", "D3.js"],
        estado: "en_desarrollo",
        activo: true,
      },
      {
        slug: "softsite",
        nombre: "SoftSite",
        descripcion: "Plataforma para crear sitios web profesionales sin código. Diseños modernos, SEO optimizado y hosting incluido.",
        tecnologias: ["Next.js", "Tailwind", "Vercel", "Supabase"],
        estado: "proximamente",
        activo: true,
      },
      {
        slug: "softflow",
        nombre: "SoftFlow",
        descripcion: "Automatización de procesos empresariales. Conecta tus herramientas, reduce tareas manuales y enfócate en lo que importa.",
        tecnologias: ["Node.js", "n8n", "PostgreSQL", "Webhooks"],
        estado: "proximamente",
        activo: true,
      },
    ],
  });

  // Testimonios
  await prisma.testimonio.deleteMany();
  await prisma.testimonio.createMany({
    data: [
      {
        nombre: "Carolina Muñoz",
        cargo: "Dueña",
        empresa: "Cafetería El Rincón",
        texto: "SoftPOS transformó completamente la manera en que gestionamos nuestro negocio. Las ventas se procesan en segundos y el inventario se actualiza solo. No podemos imaginar volver a trabajar sin él.",
        estrellas: 5,
        orden: 1,
        activo: true,
      },
      {
        nombre: "Rodrigo Pérez",
        cargo: "Gerente General",
        empresa: "Distribuidora Los Andes",
        texto: "El equipo de Softlink entendió perfectamente nuestros procesos y entregó una solución a medida en tiempo récord. El soporte post-entrega es excepcional — siempre disponibles cuando los necesitamos.",
        estrellas: 5,
        orden: 2,
        activo: true,
      },
      {
        nombre: "Francisca Torres",
        cargo: "Administradora",
        empresa: "Clínica Dental Sonrisa",
        texto: "Llevamos 8 meses usando el sistema y la diferencia es notable. Los reportes automáticos nos ahorran horas de trabajo manual cada semana. La inversión se pagó sola en el primer mes.",
        estrellas: 5,
        orden: 3,
        activo: true,
      },
      {
        nombre: "Marcelo Ibáñez",
        cargo: "Director",
        empresa: "Constructora Ibáñez e Hijos",
        texto: "Lo que más valoramos es que no vendieron software genérico — construyeron exactamente lo que necesitábamos. Precio justo, calidad de primer nivel y comunicación transparente en todo momento.",
        estrellas: 5,
        orden: 4,
        activo: true,
      },
    ],
  });

  // Artículos de blog
  await prisma.articulo.deleteMany();
  await prisma.articulo.createMany({
    data: [
      {
        slug: "como-digitalizar-tu-pyme-en-2025",
        titulo: "Cómo digitalizar tu PYME en 2025 sin gastar una fortuna",
        resumen: "Guía práctica para dar los primeros pasos en la transformación digital de tu negocio. Herramientas accesibles, resultados reales.",
        contenido: `# Cómo digitalizar tu PYME en 2025 sin gastar una fortuna

La transformación digital no es solo para grandes empresas. En 2025, las PYMEs chilenas tienen acceso a herramientas de clase mundial a precios accesibles.

## ¿Por dónde empezar?

El primer paso es identificar los procesos que más tiempo te consumen. Generalmente son:

- **Facturación y pagos**: sistemas como SoftPOS automatizan esto completamente.
- **Inventario**: el control manual genera errores y pérdidas.
- **Comunicación con clientes**: WhatsApp Business más un CRM simple puede transformar tu relación con clientes.

## Herramientas esenciales

### 1. Punto de venta en la nube
Un POS moderno te permite procesar pagos, controlar inventario y ver reportes desde cualquier dispositivo. La inversión se recupera en el primer mes.

### 2. Contabilidad digital
Elimina el papel. Plataformas conectadas al SII simplifican la declaración de IVA y los libros contables.

### 3. Presencia web
Un sitio web profesional ya no cuesta millones. Hoy puedes tener uno funcional y bien posicionado por un precio razonable mensual.

## Conclusión

La digitalización no es una opción — es una necesidad competitiva. Empieza pequeño, mide resultados y escala gradualmente.`,
        tags: ["Digitalización", "PYMEs", "Guías"],
        publicado: true,
        publicadoEn: new Date("2025-04-15"),
      },
      {
        slug: "beneficios-sistema-pos-nube",
        titulo: "5 beneficios de tener un sistema POS en la nube para tu negocio",
        resumen: "Descubre por qué los negocios que adoptan sistemas POS en la nube reportan hasta 40% más eficiencia operacional.",
        contenido: `# 5 beneficios de tener un sistema POS en la nube

Los sistemas de punto de venta basados en la nube están revolucionando la manera en que los negocios gestionan sus operaciones diarias.

## 1. Acceso desde cualquier dispositivo

Con un POS en la nube, puedes ver tus ventas y reportes desde tu teléfono, tablet o computador, estés donde estés. Ya no necesitas estar físicamente en el local.

## 2. Actualizaciones automáticas

Olvídate de instalar software o contratar técnicos. Las actualizaciones se aplican automáticamente, y siempre tendrás la última versión.

## 3. Backup automático de datos

Tus datos están seguros en la nube. No hay riesgo de perder información por fallas de hardware o robos.

## 4. Reportes en tiempo real

Toma decisiones basadas en datos actualizados al minuto. ¿Qué productos se venden más? ¿A qué hora hay más clientes? Todo disponible con un click.

## 5. Integración con otras herramientas

Los POS modernos se conectan con tu contabilidad, e-commerce, y herramientas de marketing. Un ecosistema conectado que trabaja solo.

## ¿Estás listo para dar el salto?

En Softlink, llevamos negocios chilenos al siguiente nivel con SoftPOS. Solicita una demo gratuita y compruébalo tú mismo.`,
        tags: ["POS", "Cloud", "Ventas"],
        publicado: true,
        publicadoEn: new Date("2025-04-08"),
      },
      {
        slug: "automatizacion-procesos-pymes-chile",
        titulo: "Automatización de procesos: el próximo gran salto para las PYMEs chilenas",
        resumen: "Cómo la automatización inteligente está cambiando la manera en que las empresas pequeñas compiten con las grandes.",
        contenido: `# Automatización de procesos para PYMEs

La brecha entre grandes empresas y PYMEs en términos de tecnología se está cerrando. La automatización de procesos, antes exclusiva de corporaciones, hoy está al alcance de cualquier negocio.

## ¿Qué se puede automatizar?

### Procesos administrativos
- Generación automática de facturas
- Envío de recordatorios de pago
- Reportes financieros semanales

### Atención al cliente
- Respuestas automáticas a consultas frecuentes
- Seguimiento de pedidos
- Encuestas de satisfacción post-compra

### Marketing
- Emails de bienvenida y seguimiento
- Publicaciones programadas en redes sociales
- Segmentación automática de clientes

## El ROI de la automatización

Los negocios que implementan automatización reportan en promedio:
- **30% menos tiempo** en tareas administrativas
- **25% menos errores** en procesos manuales
- **Mejor satisfacción** de empleados al enfocarse en trabajo de valor

## Cómo empezar

1. Identifica el proceso que más tiempo consume
2. Busca una herramienta específica para ese proceso
3. Implementa, mide y ajusta

No intentes automatizar todo de golpe. Un paso a la vez.`,
        tags: ["Automatización", "Tendencias", "Productividad"],
        publicado: true,
        publicadoEn: new Date("2025-04-01"),
      },
    ],
  });

  // Configuración del sitio
  const configEntries = [
    { clave: "email_contacto", valor: "contacto@softlink.cl" },
    { clave: "telefono", valor: "+56 9 9999 9999" },
    { clave: "whatsapp", valor: "56999999999" },
    { clave: "eslogan", valor: "Más que tecnología, un compromiso contigo" },
    { clave: "hero_titulo", valor: "Soluciones digitales que resuelven lo que importa" },
    { clave: "hero_subtitulo", valor: "Desarrollamos software SaaS y soluciones a medida para PYMEs chilenas." },
  ];
  for (const entry of configEntries) {
    await prisma.configSitio.upsert({
      where: { clave: entry.clave },
      update: { valor: entry.valor },
      create: entry,
    });
  }

  console.log("✅ Seed completado:");
  console.log("   - 1 super_admin (admin@softlink.cl / admin123)");
  console.log("   - 2 integrantes");
  console.log("   - 4 productos");
  console.log("   - 4 testimonios");
  console.log("   - 3 artículos de blog");
  console.log("   - 6 configuraciones del sitio");
}

main()
  .catch(e => { console.error("❌", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
