import Link from "next/link";

const CARDS = [
  { href: "/admin/pages", label: "Pages", description: "Edit section content for Home, About, Pricing and Contact." },
  { href: "/admin/services", label: "Services", description: "Manage your five service pages — text, images and order." },
  { href: "/admin/testimonials", label: "Testimonials", description: "Add, edit and feature client testimonials." },
  { href: "/admin/settings", label: "Site Settings", description: "Update your contact details, social links and footer." },
];

export default function AdminDashboard() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mb-8 text-sm text-gray-500">
        Welcome to the Tenacity content management panel.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-gray-200 bg-white p-6 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <h2 className="font-semibold text-gray-900">{card.label}</h2>
            <p className="mt-1 text-sm text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
