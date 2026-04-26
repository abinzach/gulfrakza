import { defineField, defineType } from "sanity";

export default defineType({
  name: "serviceCategory",
  title: "Service Category",
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
        maxLength: 80,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "localizedText",
      title: "Description",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageSrc",
      type: "string",
      title: "Hero image path (site asset)",
      group: "content",
      description:
        "Optional. Use this to reference an existing file under /public (e.g. /images/services/hero-1.avif).",
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
      name: "services",
      type: "array",
      title: "Services",
      group: "content",
      description: "Add the services that belong to this category. Order matters.",
      of: [
        {
          type: "reference",
          to: [{ type: "service" }],
        },
      ],
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Sort order",
      group: "content",
      description: "Lower numbers appear first on the website.",
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
      slug: "slug.current",
      media: "heroImage",
    },
    prepare({ titleEn, titleAr, slug, media }) {
      return {
        title: titleEn || titleAr || "Untitled service category",
        subtitle: slug,
        media,
      };
    },
  },
});
