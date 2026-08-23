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
    _updatedAt,
    "slug": slug.current,
    title,
    description,
    imageSrc,
    heroImage,
    order,
    indexArabic,
    services[]-> {
      _id,
      _updatedAt,
      "slug": slug.current,
      title,
      description,
      imageSrc,
      heroImage,
      order,
      indexArabic
    }
  }
`;

export const serviceDetailQuery = groq`
  *[_type == "service" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    "slug": slug.current,
    title,
    description,
    body,
    imageSrc,
    heroImage,
    seoTitle,
    seoDescription,
    indexArabic,
    reviewedBy,
    lastReviewedAt,
    category->{
      _id,
      "slug": slug.current,
      title
    }
  }
`;
