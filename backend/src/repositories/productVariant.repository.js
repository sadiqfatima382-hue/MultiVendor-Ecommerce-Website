import prisma from "../config/prisma.js";

export async function findProductVariantById(id) {
    return prisma.productVariant.findUnique({
        where: { id }
    });
}

export async function findProductVariantBySku(sku) {
    return prisma.productVariant.findUnique({
        where: { sku }
    });
}

export async function createProductVariant(data) {
    return prisma.productVariant.create({
        data ,
    });
}

export async function findProductVariants({
    skip,
    take,
    where,
    orderBy,
}) {
    return prisma.productVariant.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
            id: true,
            sku: true,
            price: true,
            comparePrice: true,
            stock: true,

            product: {
                select: {
                    id: true,
                    name: true,
                },
            },

            color: {
                select: {
                    id: true,
                    name: true,
                },
            },

            size: {
                select: {
                    id: true,
                    name: true,
                },
            },

            weight: {
                select: {
                    id: true,
                    value: true,
                    unit: true,
                },
            },

            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function countProductVariants(where) {
    return prisma.productVariant.count({
        where,
    })
}

export async function updateProductVariant(id, data) {
    return prisma.productVariant.update({
        where: {
            id
        }, data,
        select: {
            id: true,
            sku: true,
            price: true,
            comparePrice: true,
            stock: true,

            product: {
                select: {
                    id: true,
                    name: true,
                },
            },

            color: {
                select: {
                    id: true,
                    name: true,
                },
            },

            size: {
                select: {
                    id: true,
                    name: true,
                },
            },

            weight: {
                select: {
                    id: true,
                    value: true,
                    unit: true,
                },
            },

            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function deleteProductVariant(id){
    return prisma.productVariant.delete({
        where: {
            id,
        }
    })
}

export async function findProductById(id) {
  return prisma.product.findUnique({
    where: {
      id,
    },
  });
}

export async function findProductSizeById(id) {
    return prisma.productSize.findUnique({
        where: { id },
    });
}

export async function findProductColorById(id) {
    return prisma.productColor.findUnique({
        where: { id },
    });
}

export async function findProductWeightById(id) {
    return await prisma.ProductWeight.findUnique({
        where: {id},
        

    });

};