import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceEditorForm } from "./ServiceEditorForm";

type PageProps = { params: Promise<{ serviceId: string }> };

export default async function ServiceEditor({ params }: PageProps) {
  const { serviceId } = await params;
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) notFound();

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/services" className="text-sm text-gray-400 hover:text-gray-900">
          ← Services
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">{service.title}</h1>
      </div>
      <ServiceEditorForm service={service} />
    </>
  );
}
