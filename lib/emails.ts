const ACCENT = "#6c63ff";
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://softlink.cl";

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin:0; padding:0; background:#f5f5f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width:600px; margin:32px auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e5ea; }
    .header { background:${ACCENT}; padding:32px; text-align:center; }
    .header h1 { margin:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:-0.3px; }
    .header span { color:rgba(255,255,255,0.8); font-size:13px; }
    .body { padding:32px; color:#1a1a2e; }
    .body h2 { font-size:18px; font-weight:600; margin:0 0 16px; color:#1a1a2e; }
    .body p { font-size:14px; line-height:1.7; color:#555568; margin:0 0 12px; }
    .field { background:#f8f8fc; border-radius:8px; padding:12px 16px; margin-bottom:10px; }
    .field .label { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#9999b3; margin-bottom:4px; }
    .field .value { font-size:14px; color:#1a1a2e; }
    .btn { display:inline-block; background:${ACCENT}; color:#ffffff !important; text-decoration:none; padding:12px 24px; border-radius:8px; font-size:14px; font-weight:600; margin:16px 0; }
    .divider { height:1px; background:#e5e5ea; margin:24px 0; }
    .footer { background:#f8f8fc; padding:20px 32px; text-align:center; }
    .footer p { font-size:12px; color:#9999b3; margin:4px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Soft<span style="color:rgba(255,255,255,0.6)">link</span></h1>
      <span>Más que tecnología, un compromiso contigo</span>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Softlink SpA · Santiago, Chile</p>
      <p><a href="${BASE}" style="color:${ACCENT}">softlink.cl</a></p>
    </div>
  </div>
</body>
</html>`;
}

export function emailNuevoLead(data: {
  nombre: string;
  email: string;
  empresa?: string | null;
  mensaje: string;
}) {
  const adminContent = `
    <h2>📬 Nuevo lead recibido</h2>
    <p>Alguien quiere saber más sobre Softlink. Aquí están sus datos:</p>
    <div class="field"><div class="label">Nombre</div><div class="value">${data.nombre}</div></div>
    <div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${data.email}" style="color:${ACCENT}">${data.email}</a></div></div>
    ${data.empresa ? `<div class="field"><div class="label">Empresa</div><div class="value">${data.empresa}</div></div>` : ""}
    <div class="field"><div class="label">Mensaje</div><div class="value">${data.mensaje}</div></div>
    <div class="divider"></div>
    <a href="${BASE}/admin/leads" class="btn">Ver en el panel →</a>
  `;

  const clientContent = `
    <h2>Gracias por contactarnos, ${data.nombre.split(" ")[0]} 👋</h2>
    <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo a la brevedad.</p>
    <p>Mientras tanto, si tienes alguna pregunta urgente puedes escribirnos directamente a <a href="mailto:${process.env.EMAIL_TO ?? "contacto@softlink.cl"}" style="color:${ACCENT}">${process.env.EMAIL_TO ?? "contacto@softlink.cl"}</a>.</p>
    <div class="divider"></div>
    <p style="font-size:13px;color:#9999b3;">Tu mensaje:</p>
    <div class="field"><div class="value">${data.mensaje}</div></div>
    <a href="${BASE}" class="btn">Ver nuestros productos →</a>
  `;

  return {
    adminHtml: baseTemplate(adminContent),
    clientHtml: baseTemplate(clientContent),
    adminSubject: `Nuevo lead: ${data.nombre}`,
    clientSubject: "Recibimos tu mensaje — Softlink",
  };
}

export function emailNuevaDemo(data: {
  nombre: string;
  email: string;
  empresa?: string | null;
  telefono?: string | null;
  mensaje?: string | null;
  productoNombre: string;
}) {
  const adminContent = `
    <h2>🎯 Nueva solicitud de demo</h2>
    <p><strong>${data.nombre}</strong> quiere ver una demo de <strong>${data.productoNombre}</strong>.</p>
    <div class="field"><div class="label">Nombre</div><div class="value">${data.nombre}</div></div>
    <div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${data.email}" style="color:${ACCENT}">${data.email}</a></div></div>
    ${data.empresa ? `<div class="field"><div class="label">Empresa</div><div class="value">${data.empresa}</div></div>` : ""}
    ${data.telefono ? `<div class="field"><div class="label">Teléfono</div><div class="value">${data.telefono}</div></div>` : ""}
    ${data.mensaje ? `<div class="field"><div class="label">Mensaje</div><div class="value">${data.mensaje}</div></div>` : ""}
    <div class="field"><div class="label">Producto</div><div class="value">${data.productoNombre}</div></div>
    <div class="divider"></div>
    <a href="${BASE}/admin/demos" class="btn">Gestionar en el panel →</a>
  `;

  const clientContent = `
    <h2>¡Solicitud recibida, ${data.nombre.split(" ")[0]}! 🚀</h2>
    <p>Hemos recibido tu solicitud de demo para <strong>${data.productoNombre}</strong>.</p>
    <p>Uno de nuestros ingenieros te contactará en las próximas horas hábiles para coordinar la sesión.</p>
    <div class="divider"></div>
    <p style="font-size:13px;color:#9999b3;">Resumen de tu solicitud:</p>
    <div class="field"><div class="label">Producto</div><div class="value">${data.productoNombre}</div></div>
    ${data.empresa ? `<div class="field"><div class="label">Empresa</div><div class="value">${data.empresa}</div></div>` : ""}
    <a href="${BASE}/productos" class="btn">Explorar más productos →</a>
  `;

  return {
    adminHtml: baseTemplate(adminContent),
    clientHtml: baseTemplate(clientContent),
    adminSubject: `Demo solicitada: ${data.productoNombre} — ${data.nombre}`,
    clientSubject: `Tu solicitud de demo de ${data.productoNombre} fue recibida`,
  };
}

export function emailDemoConfirmada(data: {
  nombre: string;
  email: string;
  productoNombre: string;
}) {
  const content = `
    <h2>Tu demo está confirmada ✅</h2>
    <p>Hola <strong>${data.nombre.split(" ")[0]}</strong>,</p>
    <p>Nos complace confirmar tu demo de <strong>${data.productoNombre}</strong>. En breve recibirás los detalles de conexión y horario por este mismo correo.</p>
    <div class="divider"></div>
    <p>¿Tienes preguntas antes de la demo? Escríbenos a <a href="mailto:${process.env.EMAIL_TO ?? "contacto@softlink.cl"}" style="color:${ACCENT}">${process.env.EMAIL_TO ?? "contacto@softlink.cl"}</a>.</p>
    <a href="${BASE}" class="btn">Conoce más sobre Softlink →</a>
  `;

  return {
    html: baseTemplate(content),
    subject: `Demo confirmada — ${data.productoNombre}`,
  };
}
