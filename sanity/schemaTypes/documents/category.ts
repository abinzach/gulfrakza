import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'localizedString',
      title: 'Title',
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
        maxLength: 80,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'parent',
      type: 'reference',
      title: 'Parent category',
      group: 'content',
      to: [{ type: 'category' }],
      description: 'Leave empty for top-level categories. Enables nested hierarchies.',
      options: {
        disableNew: true,
      },
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      title: 'Hero image',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'summary',
      type: 'localizedText',
      title: 'Summary',
      group: 'content',
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Sort order',
      group: 'content',
      description: 'Lower numbers appear first in navigation lists.',
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
  ],
  preview: {
    select: {
      titleEn: 'title.en',
      titleAr: 'title.ar',
      slug: 'slug.current',
      media: 'heroImage',
    },
    prepare({ titleEn, titleAr, slug, media }) {
      return {
        title: titleEn || titleAr || 'Untitled category',
        subtitle: slug,
        media,
      };
    },
  },
});
