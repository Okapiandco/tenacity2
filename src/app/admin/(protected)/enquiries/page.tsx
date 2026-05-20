import { prisma } from "@/lib/prisma";

export default async function EnquiriesAdmin() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Enquiries</h1>
      <p className="mb-8 text-sm text-gray-500">{submissions.length} submission{submissions.length !== 1 ? "s" : ""} received</p>

      {submissions.length === 0 ? (
        <p className="text-sm text-gray-400">No enquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <div key={s.id} className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{s.name}</p>
                  <a href={`mailto:${s.email}`} className="text-sm text-brand-ink hover:underline">{s.email}</a>
                  {s.phone && <p className="text-sm text-gray-500">{s.phone}</p>}
                  {s.company && <p className="text-sm text-gray-500">{s.company}</p>}
                </div>
                <p className="shrink-0 text-xs text-gray-400">
                  {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{s.message}</p>
              {s.hearAbout && (
                <p className="mt-3 text-xs text-gray-400">Heard about us via: {s.hearAbout}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
