"use client";

import dynamic from "next/dynamic";

const StudioInner = dynamic(
  async () => {
    const [{ NextStudio }, { default: config }] = await Promise.all([
      import("next-sanity/studio"),
      import("../../../../sanity.config"),
    ]);
    const Inner = () => <NextStudio config={config} />;
    return Inner;
  },
  { ssr: false, loading: () => null },
);

export function Studio() {
  return <StudioInner />;
}
