"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export type NavService = { title: string; slug: string };

type NavProps = {
  services: NavService[];
  transparent?: boolean;
};

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

const trailingLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function Nav({ services, transparent = false }: NavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal mounting is client-side only and depends on mounted state to avoid hydration issues
    setMounted(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- closing menus on route change is the intended side effect
    setMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkBase =
    "relative text-sm transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

  const linkTone = (active: boolean) =>
    transparent
      ? active
        ? "text-white"
        : "text-white/85 hover:text-white"
      : active
        ? "text-brand-ink"
        : "text-ink hover:text-brand-ink";

  return (
    <>
      <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
        {primaryLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(linkBase, linkTone(isActive(l.href)))}
          >
            {l.label}
          </Link>
        ))}

        <div
          className="relative"
          onMouseEnter={() => setServicesOpen(true)}
          onMouseLeave={() => setServicesOpen(false)}
        >
          <button
            type="button"
            aria-expanded={servicesOpen}
            aria-haspopup="menu"
            onClick={() => setServicesOpen((o) => !o)}
            className={cn(
              "inline-flex items-center gap-1 text-sm transition-colors",
              transparent
                ? isActive("/services")
                  ? "text-white"
                  : "text-white/85 hover:text-white"
                : isActive("/services")
                  ? "text-brand-ink"
                  : "text-ink hover:text-brand-ink",
            )}
          >
            Support &amp; Solutions
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                servicesOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
          {servicesOpen ? (
            <div className="absolute left-1/2 top-full z-40 w-64 -translate-x-1/2 pt-3">
              <div
                role="menu"
                className="overflow-hidden rounded-md border border-border bg-white shadow-xl ring-1 ring-black/[0.04]"
              >
                <Link
                  href="/services"
                  role="menuitem"
                  className="block border-b border-border px-4 py-3 text-sm font-medium text-ink hover:bg-surface"
                >
                  Support &amp; Solutions overview
                </Link>
                <ul>
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {trailingLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(linkBase, linkTone(isActive(l.href)))}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-4 md:flex">
        <a
          href="https://www.linkedin.com/in/rebecca-phillips-742361a/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
            transparent
              ? "bg-white/20 text-white hover:bg-white hover:text-brand-ink"
              : "bg-brand-ink text-white hover:bg-accent hover:text-ink",
          )}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <ButtonLink
          href="/contact"
          size="md"
          className={cn(
            transparent &&
              "border border-white/60 bg-transparent text-white hover:border-white hover:bg-white hover:text-ink",
          )}
        >
          Book a call
        </ButtonLink>
      </div>

      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(true)}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors md:hidden",
          transparent ? "text-white" : "text-ink",
        )}
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {mounted && menuOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex flex-col bg-white md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <div className="flex h-16 items-center justify-end px-4 sm:px-6">
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <nav
                aria-label="Mobile"
                className="flex flex-1 flex-col overflow-y-auto px-6 pb-10"
              >
                <ul className="flex flex-col gap-6 text-2xl font-semibold text-ink">
                  {primaryLinks.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="block hover:text-brand-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/services" className="block hover:text-brand-ink">
                      Support &amp; Solutions
                    </Link>
                    <ul className="mt-3 flex flex-col gap-3 border-l border-border pl-4 text-base font-normal text-muted">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/services/${s.slug}`}
                            className="hover:text-brand-ink"
                          >
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {trailingLinks.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="block hover:text-brand-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <ButtonLink href="/contact" size="lg" className="w-full">
                    Book a call
                  </ButtonLink>
                </div>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
