import prisma from "../config/prisma.js";

export async function createHomePageComponent(
  data,
  db = prisma
) {
  return db.homePageComponent.create({
    data,
    include: {
      componentType: true,
    },
  });
}

export async function findHomePageComponentById(
  id,
  db = prisma
) {
  return db.homePageComponent.findUnique({
    where: {
      id,
    },
    include: {
      componentType: true,
      homePage: true,
    },
  });
}

export async function findHomePageComponents(
  homePageId,
  db = prisma
) {
  return db.homePageComponent.findMany({
    where: {
      homePageId,
    },
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      componentType: true,
    },
  });
}

export async function findComponentTypeById(
  id,
  db = prisma
) {
  return db.componentType.findUnique({
    where: {
      id,
    },
  });
}

export async function findHomePageComponentByOrder(
  homePageId,
  sortOrder,
  db = prisma
) {
  return db.homePageComponent.findUnique({
    where: {
      homePageId_sortOrder: {
        homePageId,
        sortOrder,
      },
    },
  });
}

export async function updateHomePageComponent(
  id,
  data,
  db = prisma
) {
  return db.homePageComponent.update({
    where: {
      id,
    },
    data,
    include: {
      componentType: true,
    },
  });
}

export async function deleteHomePageComponent(
  id,
  db = prisma
) {
  return db.homePageComponent.delete({
    where: {
      id,
    },
  });
}