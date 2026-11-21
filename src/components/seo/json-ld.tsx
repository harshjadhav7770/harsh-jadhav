import React from "react";
import { SKILLHUB_META } from "@/lib/constants";

export function JsonLd({
  name,
  jobTitle,
  url,
  image,
  sameAs = [],
}: {
  name: string;
  jobTitle: string;
  url: string;
  image?: string;
  sameAs?: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    url,
    image,
    sameAs,
    creator: {
      "@type": "Organization",
      name: SKILLHUB_META.organization,
      url: SKILLHUB_META.website,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
