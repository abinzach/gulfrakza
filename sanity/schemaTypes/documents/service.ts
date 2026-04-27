import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "localizedString",
      title: "Title",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      group: "content",
      options: {
        source: "title.en",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      title: "Service category",
      group: "content",
      to: [{ type: "serviceCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "localizedText",
      title: "Short description",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageSrc",
      type: "string",
      title: "Image path (site asset)",
      group: "content",
      description:
        "Optional. Use this to reference an existing file under /public (e.g. /images/services/thumb-1.avif).",
    }),
    defineField({
      name: "heroImage",
      type: "image",
      title: "Hero image (Sanity asset)",
      group: "content",
      description: "Optional. Upload an image instead of using imageSrc.",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Sort order",
      group: "content",
      description: "Lower numbers appear first within a category.",
    }),

    defineField({
      name: "body",
      type: "localizedBlockContent",
      title: "Long description",
      group: "content",
    }),
    defineField({
      name: "seoTitle",
      type: "localizedString",
      title: "SEO title",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      type: "localizedText",
      title: "SEO description",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleAr: "title.ar",
      categoryEn: "category.title.en",
      categoryAr: "category.title.ar",
      media: "heroImage",
      imageSrc: "imageSrc",
      slug: "slug.current",
    },
    prepare({ titleEn, titleAr, categoryEn, categoryAr, media, imageSrc, slug }) {
      const title = titleEn || titleAr || "Untitled service";
      const category = categoryEn || categoryAr;
      return {
        title,
        subtitle: [category, slug].filter(Boolean).join(" · "),
        media: media || undefined,
      };
    },
  },
});
