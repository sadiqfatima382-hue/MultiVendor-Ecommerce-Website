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

//Vendor Product repository 

export async function findVendorProducts({
  vendorId,
  skip,
  take,
  where,
  orderBy,
}) {
  return prisma.product.findMany({
    where: {
      vendorId,
      ...where,
    },
    skip,
    take,
    orderBy,

    include: {
      category: true,
      brand: true,
      type: true,
      base: true,
      badge: true,
      variants: true,
      images: true,
    },
  });
}

export async function findVendorProductById(
  vendorId,
  productId
) {
  return prisma.product.findFirst({
    where: {
      id: productId,
      vendorId,
    },

    include: {
      category: true,
      brand: true,
      type: true,
      base: true,
      badge: true,
      variants: true,
      images: true,
    },
  });
}

export async function countVendorProducts(
  vendorId,
  where = {}
) {
  return prisma.product.count({
    where: {
      vendorId,
      ...where,
    },
  });
}

export async function countLowStockProducts(
  vendorId
) {
  return prisma.productVariant.count({
    where: {
      product: {
        vendorId,
      },

      stock: {
        lte: 5,
      },
    },
  });
}

export async function countOutOfStockProducts(
  vendorId
) {
  return prisma.productVariant.count({
    where: {
      product: {
        vendorId,
      },

      stock: 0,
    },
  });
}

export async function submitProduct(productId) {
  return prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      status: "PENDING_APPROVAL",
    },
  });
}