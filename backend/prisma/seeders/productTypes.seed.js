import prisma from "../../src/config/prisma.js";

const productTypes = [
  {
    name: "Simple Product",
    slug: "simple-product",
  },
  {
    name: "Variable Product",
    slug: "variable-product",
  },
  {
    name: "Digital Product",
    slug: "digital-product",
  },
  {
    name: "Subscription Product",
    slug: "subscription-product",
  },
];

export async function seedProductTypes() {
  console.log("🌱 Seeding Product Types...");

  for (const type of productTypes) {
    await prisma.productType.upsert({
      where: {
        slug: type.slug,
      },
      update: {},
      create: type,
    });
  }

  console.log("✅ Product Types Seeded");
}