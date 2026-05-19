import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsAdmin() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "settings" },
    include: { socials: { orderBy: { order: "asc" } } },
  });

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Site Settings</h1>
      <SettingsForm settings={settings} />
    </>
  );
}
