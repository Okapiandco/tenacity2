import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#content" className="skip-to-content">
        Skip to content
      </a>
      <Header />
      <main id="content">{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
