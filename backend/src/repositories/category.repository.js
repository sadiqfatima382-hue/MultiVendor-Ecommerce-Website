import prisma from "../config/prisma.js";
//create
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

//get
export async function findCategories({
  skip,
  take,
  where,
  orderBy,
}) {
  return prisma.productCategory.findMany({
    skip,
    take,
    where,
    orderBy,

    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      status: true,
      parentId: true,

      parent: {
        select: {
          id: true,
          name: true,
        },
      },

      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function countCategories(where) {
  return prisma.productCategory.count({
    where,
  });
}

export async function updateCategory(id, data) {
  return prisma.productCategory.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      status: true,
      parentId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteCategory(id) {
  return prisma.productCategory.delete({
    where: { id },
  });
}

export async function countChildCategories(parentId) {
  return prisma.productCategory.count({
    where: {
      parentId,
    },
  });
}

export async function countProductsByCategory(categoryId) {
  return prisma.product.count({
    where: {
      categoryId,
    },
  });
}