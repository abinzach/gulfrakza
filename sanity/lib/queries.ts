import { groq } from 'next-sanity';

export const categoryTreeQuery = groq
  *[_type == 'category']{
    _id,
    title,
    'slug': slug.current,
    summary,
    order,
    parent->{
      _id,
      title,
      'slug': slug.current
    }
  }
;

export const productSlugsQuery = groq
  *[_type == 'product' && defined(slug.current)]{
    'slug': slug.current,
    categoryPath[]->{
      'slug': slug.current
    }
  }
;

export const productDetailQuery = groq
  *[_type == 'product' && slug.current == ][0]{
    _id,
    title,
    'slug': slug.current,
    sku,
    brand,
    summary,
    body,
    features,
    specifications,
    resources,
    heroImage,
    gallery,
    seoTitle,
    seoDescription,
    status,
    categoryPath[]->{
      _id,
      title,
      'slug': slug.current,
      parent->{
        _id,
        title,
        'slug': slug.current
      }
    }
  }
;
