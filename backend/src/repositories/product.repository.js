import prisma from "../config/prisma.js";

export async function findProductByName(name) {
  return prisma.product.findFirst({
    where: {
       name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
}

export async function findProductBySlug(slug) {
  return prisma.product.findUnique({
    where: {
      slug,
    },
  });
}

export async function findProductById(id) {
  return prisma.product.findUnique({
    where: {
      id,
    },
  });
}

export async function createProduct(data) {
  return prisma.product.create({
    data,
  });
}


export async function findProducts({
  skip,
  take,
  where,
  orderBy,
}) {
  return prisma.product.findMany({
    skip,
    take,
    where,
    orderBy,

    
     select: {
    id: true,
    name: true,
    slug: true,
    shortDescription: true,
    description: true,
    status: true,

    category: {
        select: {
            id: true,
            name: true,
        },
    },

    brand: {
        select: {
            id: true,
            name: true,
        },
    },

    type: {
        select: {
            id: true,
            name: true,
        },
    },

    base: {
        select: {
            id: true,
            name: true,
        },
    },

    badge: {
        select: {
            id: true,
            name: true,
            color: true,
        },
    },

    createdAt: true,
    updatedAt: true,
}

    
  });
}

export async function countProducts(where) {
  return prisma.product.count({
    where,
  });
}

export async function updateProduct(id, data) {
  return prisma.product.update({
    where: { id },
    data,
    select: {
    id: true,
    name: true,
    slug: true,
    shortDescription: true,
    description: true,
    status: true,

    category: {
        select: {
            id: true,
            name: true,
        },
    },

    brand: {
        select: {
            id: true,
            name: true,
        },
    },

    type: {
        select: {
            id: true,
            name: true,
        },
    },

    base: {
        select: {
            id: true,
            name: true,
        },
    },

    badge: {
        select: {
            id: true,
            name: true,
            color: true,
        },
    },

    createdAt: true,
    updatedAt: true,
}
  });
}

export async function deleteProduct(id) {
  return prisma.product.delete({
    where: { id },
  });
}
export async function findCategoryById(id) {
    return prisma.productCategory.findUnique({
    where: {
      id,
    },
  });
}

export async function findBrandById(id) {
    return prisma.productBrand.findUnique({
        where: { id },
    });
}

export async function findProductTypeById(id) {
     return prisma.productType.findUnique({
        where: { id },
    });
}

export async function findProductBaseById(id) {
     return prisma.productBase.findUnique({
        where: { id },
    });
}

export async function findProductBadgeById(id) {
     return prisma.productBadge.findUnique({
        where: { id },
    });
}