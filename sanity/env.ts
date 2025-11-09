const throwIfMissing = (name: string) => {
  throw new Error(`Missing required environment variable: ${name}`);
};

const envValue = (value: string | undefined, name: string) => {
  if (!value) throwIfMissing(name);
  return value;
};

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'polviyaz';

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const apiVersion = process.env.SANITY_API_VERSION || '2024-10-01';

export const useCdn = process.env.SANITY_USE_CDN === 'true';
