import merge from "deepmerge";
import type { Metadata } from "next";

type MetadataGenerator = Omit<Metadata, "description" | "title"> & {
  title: string;
  description: string;
};

const applicationName = `Resume ${new Date().getFullYear()}`;
const author: Metadata["authors"] = {
  name: "Milind Mishra",
  url: "https://resume.milind.app",
};
const publisher = "Milind Mishra";
const twitterHandle = "@milindmishra_";

export const createMetadata = ({
  title,
  description,
  ...properties
}: MetadataGenerator): Metadata => {
  const parsedTitle = `${title} | ${applicationName}`;
  const image = "https://resume.milind.app/images/opengraph-image.png";

  const defaultMetadata: Metadata = {
    title: parsedTitle,
    description,
    applicationName,
    authors: [author],
    creator: author.name,
    formatDetection: {
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: parsedTitle,
    },
    openGraph: {
      title: parsedTitle,
      description,
      type: "website",
      siteName: applicationName,
      locale: "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
    },
    publisher,
    twitter: {
      title: parsedTitle,
      description,
      creatorId: twitterHandle,
      card: "summary_large_image",
      creator: twitterHandle,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
    },
    icons: {
      icon: [
        {
          media: "(prefers-color-scheme: light)",
          url: "/images/icon.png",
          href: "/images/icon.png",
        },
        {
          media: "(prefers-color-scheme: dark)",
          url: "/images/icon.png",
          href: "/images/icon.png",
        },
      ],
    },
  };

  const metadata: Metadata = merge(defaultMetadata, properties);

  return metadata;
};
