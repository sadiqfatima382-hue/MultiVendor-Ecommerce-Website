import prisma from "../../src/config/prisma.js";
import { ROLE_PERMISSIONS } from "../../src/constants/auth/rolePermissions.js";

export async function seedRolePermissions() {
  console.log("🌱 Seeding role permissions...");

  // Fetch all roles and permissions once
  const [roles, permissions] = await Promise.all([
    prisma.role.findMany(),
    prisma.permission.findMany(),
  ]);

  // Create lookup maps
  const roleMap = new Map(roles.map((role) => [role.name, role.id]));

  const permissionMap = new Map(
    permissions.map((permission) => [permission.name, permission.id])
  );

  // Array for bulk insert
  const rolePermissionsData = [];

  // Build role-permission relationships
  for (const [roleName, permissionNames] of Object.entries(
    ROLE_PERMISSIONS
  )) {
    const roleId = roleMap.get(roleName);

    if (!roleId) {
      console.warn(`⚠️ Role "${roleName}" not found.`);
      continue;
    }

    for (const permissionName of permissionNames) {
      const permissionId = permissionMap.get(permissionName);

      if (!permissionId) {
        console.warn(`⚠️ Permission "${permissionName}" not found.`);
        continue;
      }

      rolePermissionsData.push({
        roleId,
        permissionId,
      });
    }
  }

  // Bulk insert
  await prisma.rolePermission.createMany({
    data: rolePermissionsData,
    skipDuplicates: true,
  });

  console.log(`✅ ${rolePermissionsData.length} role permissions seeded.`);
}