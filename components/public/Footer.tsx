"use client";

import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";

const currentYear = new Date().getFullYear();

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-3">
              <span className="text-xl font-bold tracking-tight">
                Soft<span className="text-[#6c63ff]">link</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t.footer.tagline}
            </p>
          </div>

          {/* Productos */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{t.footer.productsCol}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#productos" className="hover:text-foreground transition-colors">
                  {t.footer.catalogLink}
                </Link>
              </li>
              <li>
                <Link href="/#precios" className="hover:text-foreground transition-colors">
                  {t.footer.pricingLink}
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{t.footer.companyCol}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#equipo" className="hover:text-foreground transition-colors">
                  {t.footer.teamLink}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  {t.footer.blogLink}
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="hover:text-foreground transition-colors">
                  {t.footer.contactLink}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} Softlink SpA · Santiago, Chile</p>
          <div className="flex gap-4">
            <Link href="/legal/privacidad" className="hover:text-foreground transition-colors">
              {t.footer.privacy}
            </Link>
            <Link href="/legal/terminos" className="hover:text-foreground transition-colors">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
