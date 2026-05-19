"use client";

import { SeoMetaEditor } from "@/components/admin/SeoMetaEditor";
import { saveServiceSeo } from "./actions";

type Props = { serviceId: string; metaTitle: string; metaDescription: string };

export function ServiceSeoEditor({ serviceId, metaTitle, metaDescription }: Props) {
  return (
    <SeoMetaEditor
      metaTitle={metaTitle}
      metaDescription={metaDescription}
      onSave={(title, desc) => saveServiceSeo(serviceId, title, desc)}
    />
  );
}
