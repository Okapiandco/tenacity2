import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ServicesAdmin() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Services</h1>
      <div className="space-y-2">
        {services.map((svc) => (
          <Link
            key={svc.id}
            href={`/admin/services/${svc.id}`}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div>
              <p className="font-medium text-gray-900">{svc.title}</p>
              <p className="text-xs text-gray-400">/services/{svc.slug}</p>
            </div>
            <span className="text-sm text-gray-400">Edit →</span>
          </Link>
        ))}
        {services.length === 0 && (
          <p className="text-sm text-gray-400">
            No services yet. Run <code className="font-mono">pnpm db:seed</code> to populate.
          </p>
        )}
      </div>
    </>
  );
}
