import { defineArrayMember, defineType } from 'sanity';

export default defineType({
  name: 'blockContent',
  title: 'Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        annotations: [
          {
            name: 'externalLink',
            type: 'object',
            title: 'External link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule) => rule.required(),
              },
              {
                name: 'openInNewTab',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
});
