import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { CATALOG_CACHE_TAG } from "@/lib/cache-tags";

type SanityWebhookPayload = {
  _id?: string;
  _type?: string;
  slug?: string | null;
};

const catalogDocumentTypes = new Set(["category", "product"]);

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

    if (!body?._type || !catalogDocumentTypes.has(body._type)) {
      return NextResponse.json(
        { revalidated: false, message: "Unsupported Sanity document type." },
        { status: 400 },
      );
    }

    // Webhooks represent an external write that has already completed, so expire
    // the catalog immediately instead of serving one more stale response.
    revalidateTag(CATALOG_CACHE_TAG, { expire: 0 });
    revalidatePath("/[locale]", "layout");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({
      revalidated: true,
      document: {
        id: body._id ?? null,
        type: body._type,
        slug: body.slug ?? null,
      },
      paths: ["/[locale] (layout)", "/sitemap.xml"],
      tags: [CATALOG_CACHE_TAG],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown revalidation error.";
    console.error("Sanity revalidation failed:", message);
    return NextResponse.json({ revalidated: false, message }, { status: 500 });
  }
}
