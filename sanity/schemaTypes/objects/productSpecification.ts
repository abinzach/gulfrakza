import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'productSpecification',
  title: 'Specification',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label.en',
      subtitle: 'value.en',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Specification',
        subtitle,
      };
    },
  },
});
