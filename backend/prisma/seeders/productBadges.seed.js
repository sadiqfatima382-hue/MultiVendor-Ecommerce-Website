import prisma from "../../src/config/prisma.js";

const badges = [
  { name: "New", slug: "new", color: "#3B82F6" },
  { name: "Featured", slug: "featured", color: "#F59E0B" },
  { name: "Trending", slug: "trending", color: "#EF4444" },
  { name: "Best Seller", slug: "best-seller", color: "#10B981" },
];

export async function seedProductBadges() {
  console.log("🌱 Seeding Product Badges...");

  for (const badge of badges) {
    await prisma.productBadge.upsert({
      where: {
        slug: badge.slug,
      },
      update: {},
      create: badge,
    });
  }

  console.log("✅ Product Badges Seeded");
}