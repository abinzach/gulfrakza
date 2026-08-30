"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";

type SanityImageProps = Omit<ImageProps, "loader">;

const isSanitySource = (src: ImageProps["src"]): src is string => {
  if (typeof src !== "string") return false;

  try {
    return new URL(src).hostname === "cdn.sanity.io";
  } catch {
    return false;
  }
};

const sanityImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const url = new URL(src);

  // Preserve crop/rect parameters while requesting each responsive width
  // directly from Sanity instead of sending the image through Vercel again.
  url.searchParams.delete("h");
  url.searchParams.delete("fm");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");

  return url.toString();
};

/**
 * Uses Sanity's image CDN directly for Sanity assets while retaining Next's
 * default optimizer for local images and other remote sources.
 */
export default function SanityImage(props: SanityImageProps) {
  return (
    <Image
      {...props}
      alt={props.alt}
      loader={isSanitySource(props.src) ? sanityImageLoader : undefined}
    />
  );
}
