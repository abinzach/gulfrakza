import { groq } from "next-sanity";

/**
 * Service content is stored as:
 *  - serviceCategory (top level)
 *  - service (items)
 * Categories optionally keep an ordered list of service references.
 */

export const serviceCategoriesQuery = groq`
  *[_type == "serviceCategory"]|order(coalesce(order, 999) asc, title.en asc){
    _id,
    "slug": slug.current,
    title,
    description,
    imageSrc,
    heroImage,
    order,
    services[]-> {
      _id,
      "slug": slug.current,
      title,
      description,
      imageSrc,
      heroImage,
      order
    }
  }
`;

export const serviceSlugsQuery = groq`
  *[_type == "service" && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0]{
    _id,
    "slug": slug.current,
    title,
    description,
    imageSrc,
    heroImage,
    order,
    body,
    seoTitle,
    seoDescription,
    category-> {
      _id,
      "slug": slug.current,
      title,
      description,
      imageSrc,
      heroImage
    }
  }
`;
