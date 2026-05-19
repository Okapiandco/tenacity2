import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroEditor } from "./editors/HeroEditor";
import { IntroEditor } from "./editors/IntroEditor";
import { AboutTeaserEditor } from "./editors/AboutTeaserEditor";
import { CtaBandEditor } from "./editors/CtaBandEditor";

type PageProps = { params: Promise<{ sectionId: string }> };

export default async function SectionEditor({ params }: PageProps) {
  const { sectionId } = await params;
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: { page: true },
  });
  if (!section) notFound();

  const content = section.content as Record<string, unknown>;

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/pages" className="text-sm text-gray-400 hover:text-gray-900">
          ← Pages
        </Link>
        <span className="text-gray-300">/</span>
        <Link
          href={`/admin/pages/${section.pageId}`}
          className="text-sm text-gray-400 hover:text-gray-900"
        >
          {section.page.title}
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-semibold text-gray-900 capitalize">
          {section.type.replace(/_/g, " ")}
        </h1>
      </div>

      {section.type === "hero" && (
        <HeroEditor sectionId={section.id} content={content} />
      )}
      {section.type === "intro" && (
        <IntroEditor sectionId={section.id} content={content} />
      )}
      {section.type === "about_teaser" && (
        <AboutTeaserEditor sectionId={section.id} content={content} />
      )}
      {section.type === "cta_band" && (
        <CtaBandEditor sectionId={section.id} content={content} />
      )}
      {section.type === "service_cards" && (
        <p className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
          The Service Cards section automatically pulls content from your{" "}
          <Link href="/admin/services" className="text-blue-600 underline">
            Services
          </Link>{" "}
          list — no manual editing needed here.
        </p>
      )}
    </>
  );
}
