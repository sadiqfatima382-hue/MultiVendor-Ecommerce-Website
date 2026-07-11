import prisma from "../src/config/prisma.js";
import { seedRoles } from "./seeders/roles.seed.js";
import { seedPermissions } from "./seeders/permissions.seed.js";
import { seedRolePermissions } from "./seeders/rolePermissions.seed.js";
import { seedAdmin } from "./seeders/admin.seed.js";
import { seedProductTypes } from "./seeders/productTypes.seed.js";
import { seedProductBadges } from "./seeders/productBadges.seed.js";


async function main() {
  console.log("🌱 Starting database seeding...\n");

  //  Seed Roles
  await seedRoles();

  //  Seed Permissions
  await seedPermissions();

  //  Assign Permissions to Roles
  await seedRolePermissions();

  //  Seed Default Super Admin
  await seedAdmin();
  // Product
  await seedProductTypes();
  await seedProductBadges();
  console.log("\n✅ Database seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("\n❌ Database seeding failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });