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
    defineField({
      name: 'indexArabic',
      type: 'boolean',
      title: 'Arabic page approved for indexing',
      group: 'seo',
      initialValue: false,
      description: 'Enable only after the Arabic title, summary, and category context receive human review.',
      validation: (rule) => rule.custom((enabled, context) => {
        if (!enabled) return true;
        const document = context.document as { title?: { en?: string; ar?: string }; summary?: { ar?: string } };
        if (!document.title?.ar?.trim() || !document.summary?.ar?.trim()) return 'Arabic title and summary are required before indexing.';
        if (document.title.ar.trim() === document.title.en?.trim()) return 'Arabic title must not duplicate the English title.';
        return true;
      }),
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
