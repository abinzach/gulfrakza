import NextLink from "next/link";

/**
 * Server-safe Link export.
 *
 * IMPORTANT:
 * - This does NOT auto-prefix locale.
 * - Use this from Server Components to avoid pulling in client navigation code.
 * - For locale-aware navigation in client components, use `@/navigation.client`.
 */
export default NextLink;
