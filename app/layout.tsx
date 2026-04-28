import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LangProvider } from "@/components/providers/lang-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Softlink — Más que tecnología, un compromiso contigo",
    template: "%s | Softlink",
  },
  description:
    "Empresa chilena de desarrollo de software SaaS. Soluciones digitales que resuelven lo que importa para PYMEs.",
  keywords: ["software", "SaaS", "Chile", "desarrollo", "PYMEs", "tecnología"],
  authors: [{ name: "Softlink SpA" }],
  creator: "Softlink SpA",
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Softlink",
    title: "Softlink — Más que tecnología, un compromiso contigo",
    description: "Soluciones digitales que resuelven lo que importa para PYMEs chilenas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Softlink",
    description: "Soluciones digitales que resuelven lo que importa.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LangProvider>
            {children}
            <Toaster richColors />
            <Analytics />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
