import prisma from "../../src/config/prisma.js";
import { ROLES } from "../../src/constants/auth/roles.js";

export async function seedRoles() {
  for (const role of Object.values(ROLES)) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: {
        name: role,
      },
    });
  }

  console.log("✅ Roles seeded");
}