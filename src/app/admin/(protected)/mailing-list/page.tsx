import { prisma } from "@/lib/prisma";

export default async function MailingListAdmin() {
  const signups = await prisma.mailingListSignup.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Mailing List</h1>
      <p className="mb-8 text-sm text-gray-500">{signups.length} subscriber{signups.length !== 1 ? "s" : ""}</p>

      {signups.length === 0 ? (
        <p className="text-sm text-gray-400">No signups yet.</p>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left font-medium text-gray-600">Email</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-3">
                    <a href={`mailto:${s.email}`} className="text-brand-ink hover:underline">{s.email}</a>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(s.subscribedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
