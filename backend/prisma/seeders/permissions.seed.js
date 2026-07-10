import prisma from "../../src/config/prisma.js";
import { PERMISSIONS } from "../../src/constants/auth/permissions.js";

export async function seedPermissions() {
  for (const permission of Object.values(PERMISSIONS)) {
    await prisma.permission.upsert({
      where: { name: permission },
      update: {},
      create: {
        name: permission,
      },
    });
  }

  console.log("✅ Permissions seeded");
} 