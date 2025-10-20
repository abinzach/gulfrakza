import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'localizedString',
  title: 'Localized string',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      type: 'string',
      title: 'English',
      validation: (rule) => rule.required().warning('Consider providing at least an English value'),
    }),
    defineField({
      name: 'ar',
      type: 'string',
      title: 'Arabic',
      description: 'Arabic content (supports RTL input).',
    }),
  ],
  preview: {
    select: {
      title: 'en',
      subtitle: 'ar',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || subtitle || 'Untitled',
        subtitle: subtitle ? `AR: ${subtitle}` : undefined,
      };
    },
  },
});
