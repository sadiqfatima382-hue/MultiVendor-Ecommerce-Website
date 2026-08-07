import prisma from "../config/prisma.js";

export async function createComponentType(data, db = prisma) {
  return db.componentType.create({
    data,
  });
}

export async function findComponentTypeById(id, db = prisma) {
  return db.componentType.findUnique({
    where: {
      id,
    },
  });
}

export async function findComponentTypeBySlug(slug, db = prisma) {
  return db.componentType.findUnique({
    where: {
      slug,
    },
  });
}

export async function findComponentTypeByName(name, db = prisma) {
  return db.componentType.findFirst({
    where: {
      name,
    },
  });
}

export async function findComponentTypes({
  skip,
  take,
  where,
  orderBy,
  db = prisma,
}) {
  return db.componentType.findMany({
    skip,
    take,
    where,
    orderBy,
  });
}

export async function countComponentTypes(
  where,
  db = prisma
) {
  return db.componentType.count({
    where,
  });
}

export async function updateComponentType(
  id,
  data,
  db = prisma
) {
  return db.componentType.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteComponentType(
  id,
  db = prisma
) {
  return db.componentType.delete({
    where: {
      id,
    },
  });
}