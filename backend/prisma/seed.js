import prisma from "../src/config/prisma.js";

import { seedRoles } from "./seeders/roles.seed.js";
import { seedPermissions } from "./seeders/permissions.seed.js";
import { seedRolePermissions } from "./seeders/rolePermissions.seed.js";
import { seedAdmin } from "./seeders/admin.seed.js";

async function main() {
  console.log("🌱 Starting database seeding...\n");

  // 1. Seed Roles
  await seedRoles();

  // 2. Seed Permissions
  await seedPermissions();

  // 3. Assign Permissions to Roles
  await seedRolePermissions();

  // 4. Seed Default Super Admin
  await seedAdmin();

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