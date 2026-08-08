import prisma from "../config/prisma.js";

export async function createAdsBanner(
  data,
  db = prisma
) {
  return db.adsBanner.create({
    data,
  });
}

export async function findAdsBannerById(
  id,
  db = prisma
) {
  return db.adsBanner.findUnique({
    where: {
      id,
    },
  });
}

export async function findAdsBanners({
  skip,
  take,
  where,
  orderBy,
  db = prisma,
}) {
  return db.adsBanner.findMany({
    skip,
    take,
    where,
    orderBy,
  });
}

export async function countAdsBanners(
  where,
  db = prisma
) {
  return db.adsBanner.count({
    where,
  });
}

export async function updateAdsBanner(
  id,
  data,
  db = prisma
) {
  return db.adsBanner.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteAdsBanner(
  id,
  db = prisma
) {
  return db.adsBanner.delete({
    where: {
      id,
    },
  });
}