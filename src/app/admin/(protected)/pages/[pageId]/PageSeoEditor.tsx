"use client";

import { SeoMetaEditor } from "@/components/admin/SeoMetaEditor";
import { savePageSeo } from "./actions";

type Props = { pageId: string; metaTitle: string; metaDescription: string };

export function PageSeoEditor({ pageId, metaTitle, metaDescription }: Props) {
  return (
    <SeoMetaEditor
      metaTitle={metaTitle}
      metaDescription={metaDescription}
      onSave={(title, desc) => savePageSeo(pageId, title, desc)}
    />
  );
}
