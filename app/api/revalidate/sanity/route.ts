import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { locales } from "@/i18n/config";
import {
  CATALOG_CATEGORIES_CACHE_TAG,
  CATALOG_PRODUCTS_CACHE_TAG,
  productCacheTag,
} from "@/lib/cache-tags";

type SanityWebhookPayload = {
  _id?: string;
  _type?: string;
  slug?: string | { current?: string | null } | null;
};

const catalogDocumentTypes = new Set(["category", "product"]);
// Services render from a token-authenticated Sanity client whose reads are
// never cached, so they carry no cache tags to expire — the prerendered routes
// have to be revalidated by path instead. Without this the webhook rejected
// every service edit with a 400 and the pages stayed stale until a redeploy.
const serviceDocumentTypes = new Set(["service", "serviceCategory"]);

const getSlug = (slug: SanityWebhookPayload["slug"]) => {
  if (typeof slug === "string") return slug.trim() || null;
  return slug?.current?.trim() || null;
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { revalidated: false, message: "SANITY_REVALIDATE_SECRET is not configured." },
      { status: 500 },
    );
  }

  try {
    const { body, isValidSignature } = await parseBody<SanityWebhookPayload>(
      request,
      secret,
      true,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { revalidated: false, message: "Invalid Sanity webhook signature." },
        { status: 401 },
      );
    }

    if (
      !body?._type ||
      (!catalogDocumentTypes.has(body._type) && !serviceDocumentTypes.has(body._type))
    ) {
      return NextResponse.json(
        { revalidated: false, message: "Unsupported Sanity document type." },
        { status: 400 },
      );
    }

    const slug = getSlug(body.slug);
    const tags = new Set<string>();
    const paths = new Set<string>(["/sitemap.xml"]);

    if (serviceDocumentTypes.has(body._type)) {
      for (const locale of locales) {
        paths.add(`/${locale}`);
        paths.add(`/${locale}/services`);
        if (slug) {
          const segment =
            body._type === "serviceCategory"
              ? `category/${encodeURIComponent(slug)}`
              : encodeURIComponent(slug);
          paths.add(`/${locale}/services/${segment}`);
        }
      }
    } else if (body._type === "product") {
      tags.add(CATALOG_PRODUCTS_CACHE_TAG);
      if (slug) tags.add(productCacheTag(slug));

      for (const locale of locales) {
        paths.add(`/${locale}`);
        paths.add(`/${locale}/products`);
        if (slug) paths.add(`/${locale}/products/${encodeURIComponent(slug)}`);
      }
    } else {
      // Category changes affect navigation, catalog grouping, and product paths.
      tags.add(CATALOG_CATEGORIES_CACHE_TAG);
      tags.add(CATALOG_PRODUCTS_CACHE_TAG);

      for (const locale of locales) {
        paths.add(`/${locale}`);
        paths.add(`/${locale}/products`);
      }
    }

    // A signed Sanity webhook represents a completed external write, so expire
    // only the affected data and routes instead of the entire locale layout.
    for (const tag of tags) revalidateTag(tag, { expire: 0 });
    for (const path of paths) revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      document: {
        id: body._id ?? null,
        type: body._type,
        slug,
      },
      paths: Array.from(paths),
      tags: Array.from(tags),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown revalidation error.";
    console.error("Sanity revalidation failed:", message);
    return NextResponse.json({ revalidated: false, message }, { status: 500 });
  }
}
