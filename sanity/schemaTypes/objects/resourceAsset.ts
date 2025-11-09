import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'resourceAsset',
  title: 'Resource',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'localizedString',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'file',
      type: 'file',
      title: 'File',
      description: 'Upload brochures, datasheets, manuals or certifications',
      options: {
        storeOriginalFilename: true,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
    },
    prepare({ title }) {
      return {
        title: title || 'Resource',
      };
    },
  },
});
