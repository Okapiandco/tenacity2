import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PagesIndex() {
  const pages = await prisma.page.findMany({
    orderBy: { slug: "asc" },
    include: { _count: { select: { sections: true } } },
  });

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Pages</h1>
      <div className="space-y-2">
        {pages.map((page) => (
          <Link
            key={page.id}
            href={`/admin/pages/${page.id}`}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div>
              <p className="font-medium text-gray-900">{page.title}</p>
              <p className="text-xs text-gray-400">/{page.slug}</p>
            </div>
            <span className="text-sm text-gray-400">
              {page._count.sections} section{page._count.sections !== 1 ? "s" : ""} →
            </span>
          </Link>
        ))}
        {pages.length === 0 && (
          <p className="text-sm text-gray-400">
            No pages yet. Run <code className="font-mono">pnpm db:seed</code> to populate.
          </p>
        )}
      </div>
    </>
  );
}
