import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'localizedBlockContent',
  title: 'Localized rich text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      type: 'blockContent',
      title: 'English',
      validation: (rule) => rule.warning('Provide at least one language variant'),
    }),
    defineField({
      name: 'ar',
      type: 'blockContent',
      title: 'Arabic',
      description: 'Use for RTL content as needed.',
    }),
  ],
  preview: {
    select: {
      en: 'en',
      ar: 'ar',
    },
    prepare({ en, ar }) {
      const getFirstText = (blocks?: any[]) => {
        const block = Array.isArray(blocks) ? blocks.find((item) => item?._type === 'block') : undefined;
        return block?.children?.[0]?.text;
      };

      const title = getFirstText(en) || getFirstText(ar) || 'Rich text';
      return {
        title,
        subtitle: ar ? 'Includes Arabic copy' : undefined,
      };
    },
  },
});
