import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";
import { BrandSettingsForm } from "./BrandSettingsForm";

export default async function SettingsAdmin() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "settings" },
    include: { socials: { orderBy: { order: "asc" } } },
  });

  const brand = (settings?.brandSettings as Record<string, string>) ?? {};

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Settings</h1>

      <div className="mb-8">
        <h2 className="mb-1 text-lg font-semibold text-gray-700">Site &amp; Contact</h2>
        <p className="mb-4 text-sm text-gray-400">Contact details, social links and footer text</p>
        <SettingsForm settings={settings} />
      </div>

      <div>
        <h2 className="mb-1 text-lg font-semibold text-gray-700">Brand &amp; Design</h2>
        <p className="mb-4 text-sm text-gray-400">Colours and fonts used across the site</p>
        <BrandSettingsForm brand={{
          primaryColor: brand.primaryColor ?? "#7694b6",
          accentColor: brand.accentColor ?? "#ffc2c2",
          inkColor: brand.inkColor ?? "#6b6b6b",
          headingFont: brand.headingFont ?? "Montserrat",
          bodyFont: brand.bodyFont ?? "Montserrat",
        }} />
      </div>
    </>
  );
}
