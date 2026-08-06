import prisma from "../config/prisma.js";

export async function createWebsiteSetting(
  data,
  db = prisma
) {
  return db.websiteSetting.create({
    data,
  });
}

export async function findWebsiteSetting(
  db = prisma
) {
  return db.websiteSetting.findFirst();
}

export async function updateWebsiteSetting(
  id,
  data,
  db = prisma
) {
  return db.websiteSetting.update({
    where: {
      id,
    },
    data,
  });
}