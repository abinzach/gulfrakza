import { defineField, defineType } from 'sanity';

const trimValue = (value?: string) => {
  if (!value) return undefined;
  return value.length > 50 ? `${value.substring(0, 50)}...` : value;
};

export default defineType({
  name: 'localizedText',
  title: 'Localized text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      type: 'text',
      title: 'English',
      rows: 4,
      validation: (rule) => rule.required().warning('Consider providing at least an English value'),
    }),
    defineField({
      name: 'ar',
      type: 'text',
      title: 'Arabic',
      description: 'Arabic content (supports RTL input).',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'en',
      subtitle: 'ar',
    },
    prepare({ title, subtitle }) {
      const primary = trimValue(title) || trimValue(subtitle) || 'Untitled';
      return {
        title: primary,
        subtitle: subtitle ? `AR: ${trimValue(subtitle)}` : undefined,
      };
    },
  },
});
