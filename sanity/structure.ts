import type { StructureResolver } from 'sanity/structure';

const hiddenDocTypes = new Set(['category', 'product', 'serviceCategory', 'service']);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Categories')
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),
      S.listItem()
        .title('Products')
        .schemaType('product')
        .child(S.documentTypeList('product').title('Products')),
      S.listItem()
        .title('Service Categories')
        .schemaType('serviceCategory')
        .child(S.documentTypeList('serviceCategory').title('Service Categories')),
      S.listItem()
        .title('Services')
        .schemaType('service')
        .child(S.documentTypeList('service').title('Services')),
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenDocTypes.has(String(listItem.getId()))
      ),
    ]);
