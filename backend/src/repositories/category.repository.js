import prisma from "../config/prisma.js";

export async function findCategoryByName(name) {
  return prisma.productCategory.findUnique({
    where: {
      name,
    },
  });
}

export async function findCategoryBySlug(slug) {
  return prisma.productCategory.findUnique({
    where: {
      slug,
    },
  });
}

export async function findCategoryById(id) {
  return prisma.productCategory.findUnique({
    where: {
      id,
    },
  });
}

export async function createCategory(data) {
  return prisma.productCategory.create({
    data,
  });
}