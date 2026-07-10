import bcrypt from "bcrypt";
import prisma from "../../src/config/prisma.js";
import { ROLES } from "../../src/constants/auth/roles.js";

const DEFAULT_ADMIN = {
  name: "Super Admin",
  email: "admin18@gmail.com",
  password: "superAdmin1234",
};

export async function seedAdmin() {
  const superAdminRole = await prisma.role.findUnique({
    where: {
      name: ROLES.SUPER_ADMIN,
    },
  });

  if (!superAdminRole) {
    throw new Error("SUPER_ADMIN role not found.");
  }

  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 12);

  await prisma.user.upsert({
    where: {
      email: DEFAULT_ADMIN.email,
    },
    update: {
      password: hashedPassword,
    },
    create: {
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      password: hashedPassword,
      roleId: superAdminRole.id,
      isEmailVerified: true,
    },
  });

  console.log("✅ Default Super Admin seeded.");
}