import prisma from "../config/prisma.js";

export async function createWebsiteIcon(
  data,
  db = prisma
) {
  return db.websiteIcon.create({
    data,
  });
}

export async function findWebsiteIconById(
  id,
  db = prisma
) {
  return db.websiteIcon.findUnique({
    where: {
      id,
    },
  });
}

export async function findWebsiteIconByType(
  type,
  db = prisma
) {
  return db.websiteIcon.findUnique({
    where: {
      type,
    },
  });
}

export async function getWebsiteIcons(
  db = prisma
) {
  return db.websiteIcon.findMany({
    orderBy: {
      type: "asc",
    },
  });
}

export async function updateWebsiteIcon(
  id,
  data,
  db = prisma
) {
  return db.websiteIcon.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteWebsiteIcon(
  id,
  db = prisma
) {
  return db.websiteIcon.delete({
    where: {
      id,
    },
  });
}