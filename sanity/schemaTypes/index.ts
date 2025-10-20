import type { SchemaTypeDefinition } from 'sanity';

import category from './documents/category';
import product from './documents/product';
import blockContent from './objects/blockContent';
import localizedBlockContent from './objects/localizedBlockContent';
import localizedString from './objects/localizedString';
import localizedText from './objects/localizedText';
import productSpecification from './objects/productSpecification';
import resourceAsset from './objects/resourceAsset';

export const schemaTypes: SchemaTypeDefinition[] = [
  category,
  product,
  blockContent,
  localizedBlockContent,
  localizedString,
  localizedText,
  productSpecification,
  resourceAsset,
];
