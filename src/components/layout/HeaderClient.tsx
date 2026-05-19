"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import logo from "../../../public/tenacity-logo.png";
import { Container } from "@/components/ui/Container";
import { Nav, type NavService } from "@/components/layout/Nav";
import { cn } from "@/lib/cn";

type HeaderClientProps = {
  services: NavService[];
  linkedInUrl: string;
};

export function HeaderClient({ services, linkedInUrl }: HeaderClientProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <header
      data-transparent={transparent}
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 ease-out",
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border bg-white/85 shadow-[0_1px_0_rgba(17,24,39,0.04)] backdrop-blur supports-[backdrop-filter]:bg-white/70",
      )}
    >
      <Container className="flex h-24 items-center justify-between">
        <Link
          href="/"
          aria-label="Tenacity Business Growth Consultancy, home"
          className="group inline-flex items-center"
        >
          <Image
            src={logo}
            alt="Tenacity Business Growth Consultancy"
            className={cn(
              "-ml-2 h-16 w-auto transition-[filter,transform] duration-500 ease-out md:h-20",
              "group-hover:scale-[1.02]",
              transparent
                ? "[filter:brightness(0)_invert(1)_drop-shadow(0_1px_12px_rgba(0,0,0,0.35))]"
                : "",
            )}
            priority
          />
        </Link>
        <Nav services={services} transparent={transparent} linkedInUrl={linkedInUrl} />
      </Container>
    </header>
  );
}
