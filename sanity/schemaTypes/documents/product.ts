import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'localizedString',
      title: 'Name',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      group: 'content',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sku',
      type: 'string',
      title: 'SKU / Model number',
      group: 'content',
    }),
    defineField({
      name: 'brand',
      type: 'localizedString',
      title: 'Brand',
      group: 'content',
    }),
    defineField({
      name: 'categoryPath',
      type: 'array',
      title: 'Category path',
      group: 'content',
      description: 'Select categories in order (Category > Subcategory > Item category).',
      validation: (rule) => rule.required().min(1).max(4),
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
    }),
    defineField({
      name: 'summary',
      type: 'localizedText',
      title: 'Summary',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'localizedBlockContent',
      title: 'Detailed description',
      group: 'content',
    }),
    defineField({
      name: 'features',
      type: 'array',
      title: 'Key features',
      group: 'content',
      of: [{ type: 'localizedString' }],
    }),
    defineField({
      name: 'specifications',
      type: 'array',
      title: 'Specifications',
      group: 'content',
      of: [{ type: 'productSpecification' }],
    }),
    defineField({
      name: 'stockStatus',
      type: 'string',
      title: 'Stock status',
      group: 'content',
      description: 'Show whether the product is currently available when not tracking stock per size.',
      options: {
        layout: 'radio',
        list: [
          { title: 'In stock', value: 'in_stock' },
          { title: 'Out of stock', value: 'out_of_stock' },
        ],
      },
      initialValue: 'in_stock',
    }),
    defineField({
      name: 'sizeVariants',
      type: 'array',
      title: 'Size variants',
      group: 'content',
      description: 'Add optional size-specific inventory levels for this product.',
      of: [
        {
          type: 'object',
          name: 'sizeVariant',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Size label',
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: 'stock',
              type: 'number',
              title: 'Stock on hand',
              description: 'Leave blank if stock is not tracked for this size.',
              validation: (rule) => rule.min(0).integer(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'resources',
      type: 'array',
      title: 'Resources',
      group: 'content',
      of: [{ type: 'resourceAsset' }],
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      title: 'Gallery',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      title: 'Primary image',
      group: 'media',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seoTitle',
      type: 'localizedString',
      title: 'SEO title',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      type: 'localizedText',
      title: 'SEO description',
      group: 'seo',
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Publishing status',
      group: 'content',
      initialValue: 'active',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Draft', value: 'draft' },
          { title: 'Archived', value: 'archived' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      titleEn: 'title.en',
      titleAr: 'title.ar',
      sku: 'sku',
      media: 'heroImage',
    },
    prepare({ titleEn, titleAr, sku, media }) {
      return {
        title: titleEn || titleAr || 'Untitled product',
        subtitle: sku ? `SKU: ${sku}` : titleAr ? 'Arabic copy available' : undefined,
        media,
      };
    },
  },
});
