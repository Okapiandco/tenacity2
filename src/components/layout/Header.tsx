import { sanityFetch } from "@/sanity/lib/live";
import { HeaderClient } from "@/components/layout/HeaderClient";
import type { NavService } from "@/components/layout/Nav";

const servicesQuery = `*[_type == "service"] | order(order asc) { title, "slug": slug.current }`;

async function getServices(): Promise<NavService[]> {
  try {
    const { data } = (await sanityFetch({ query: servicesQuery })) as {
      data: NavService[];
    };
    return data;
  } catch {
    return [];
  }
}

export async function Header() {
  const services = await getServices();
  return <HeaderClient services={services} />;
}
