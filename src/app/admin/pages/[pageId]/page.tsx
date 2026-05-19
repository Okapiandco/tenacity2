import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderSections, toggleSection } from "./actions";
import { SectionReorderList } from "./SectionReorderList";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero banner",
  intro: "Introduction",
  service_cards: "Service cards",
  about_teaser: "Meet Becky (about teaser)",
  cta_band: "Call to action band",
};

type PageProps = { params: Promise<{ pageId: string }> };

export default async function PageEditor({ params }: PageProps) {
  const { pageId } = await params;
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!page) notFound();

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/pages" className="text-sm text-gray-400 hover:text-gray-900">
          ← Pages
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">{page.title}</h1>
      </div>

      <p className="mb-4 text-sm text-gray-500">
        Drag sections to reorder them. Click <strong>Edit</strong> to change content.
      </p>

      <SectionReorderList
        sections={page.sections.map((s) => ({
          id: s.id,
          type: s.type,
          label: SECTION_LABELS[s.type] ?? s.type,
          enabled: s.enabled,
          order: s.order,
        }))}
        reorderAction={reorderSections}
        toggleAction={toggleSection}
      />
    </>
  );
}
