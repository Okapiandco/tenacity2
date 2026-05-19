import Link from "next/link";
import Image from "next/image";

import logo from "../../../public/tenacity-logo.png";
import { Container } from "@/components/ui/Container";
import { MailingListForm } from "@/components/layout/MailingListForm";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-10 py-12 md:grid-cols-3">

        <div>
          <Link
            href="/"
            aria-label="Tenacity Business Growth Consultancy, home"
            className="block"
          >
            <Image
              src={logo}
              alt="Tenacity Business Growth Consultancy"
              className="-ml-2 h-16 w-auto md:h-20"
            />
          </Link>
          <p className="mt-4 text-sm text-muted">
            A Dorset-based business supporting individuals, SME owners and leaders, nationally and internationally.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/about" className="hover:text-brand-ink">About</Link></li>
            <li><Link href="/services" className="hover:text-brand-ink">Support &amp; Solutions</Link></li>
            <li><Link href="/pricing" className="hover:text-brand-ink">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-brand-ink">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-brand-ink">Privacy &amp; Cookies</Link></li>
          </ul>
        </div>

        <div>
          <div>
            <p className="text-sm font-semibold text-ink">Add me to your mailing list please</p>
            <MailingListForm />
          </div>
          <div className="mt-6 space-y-1 text-sm text-muted">
            <p>
              <a href="mailto:becky@tenacity.business" className="hover:text-brand-ink">
                becky@tenacity.business
              </a>
            </p>
            <p>
              <a href="tel:07813830335" className="hover:text-brand-ink">
                07813 830 335
              </a>
            </p>
          </div>
        </div>

      </Container>
      <div className="border-t border-border">
        <Container className="py-4 text-center text-xs text-muted sm:text-left">
          © {year} Tenacity Business Growth Consultancy. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}
