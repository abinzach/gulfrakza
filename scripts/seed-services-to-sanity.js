/* eslint-disable no-console */

// Seeds Sanity with the existing services structure from data/services.json.
//
// Usage:
//   SANITY_WRITE_TOKEN=... node scripts/seed-services-to-sanity.js
//
// Notes:
// - This is idempotent-ish: it uses deterministic _id values so re-running updates.
// - Requires a Sanity token with write access.

require("dotenv").config();

const path = require("path");
const fs = require("fs");
const { createClient } = require("@sanity/client");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "polviyaz";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2024-10-01";

const token =
  process.env.SANITY_WRITE_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_TOKEN;

if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN (or SANITY_API_WRITE_TOKEN / SANITY_TOKEN). Provide a token with write permissions.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const servicesPath = path.join(process.cwd(), "data", "services.json");
const raw = JSON.parse(fs.readFileSync(servicesPath, "utf8"));

const toSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const categoryDocId = (categoryId) => `serviceCategory.${categoryId}`;
const serviceDocId = (categoryId, serviceId) => `service.${categoryId}.${serviceId}`;

async function upsert(doc) {
  return client.createOrReplace(doc);
}

async function main() {
  console.log(`Seeding services into Sanity: ${projectId}/${dataset}`);
  console.log(`Reading: ${servicesPath}`);

  // 1) Create categories first
  for (let i = 0; i < raw.length; i++) {
    const category = raw[i];
    const catId = category.id;
    const catDoc = {
      _id: categoryDocId(catId),
      _type: "serviceCategory",
      title: {
        en: category.title?.en || catId,
        ar: category.title?.ar || "",
      },
      slug: { current: toSlug(catId) || toSlug(category.title?.en) || catId },
      description: {
        en: category.description?.en || "",
        ar: category.description?.ar || "",
      },
      imageSrc: category.imageSrc || "",
      order: i,
      services: [], // filled in next step
    };
    await upsert(catDoc);
    console.log(`✓ category: ${catId}`);
  }

  // 2) Create services and attach them to categories
  for (let i = 0; i < raw.length; i++) {
    const category = raw[i];
    const catId = category.id;

    const serviceRefs = [];
    for (let j = 0; j < (category.services || []).length; j++) {
      const service = category.services[j];
      const svcId = service.id;
      const svcDoc = {
        _id: serviceDocId(catId, svcId),
        _type: "service",
        title: {
          en: service.title?.en || svcId,
          ar: service.title?.ar || "",
        },
        slug: { current: toSlug(svcId) || toSlug(service.title?.en) || svcId },
        category: { _type: "reference", _ref: categoryDocId(catId) },
        description: {
          en: service.description?.en || "",
          ar: service.description?.ar || "",
        },
        imageSrc: service.imageSrc || "",
        order: j,
      };

      await upsert(svcDoc);
      serviceRefs.push({ _type: "reference", _ref: svcDoc._id });
      console.log(`  ✓ service: ${catId} -> ${svcId}`);
    }

    // patch category with ordered service refs
    await client
      .patch(categoryDocId(catId))
      .set({ services: serviceRefs })
      .commit();
    console.log(`✓ linked services for category: ${catId}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
