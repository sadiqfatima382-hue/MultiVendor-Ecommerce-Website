import prisma from "../config/prisma.js";

export async function findProductTypeById(id) {
    return prisma.productType.findUnique({
        where: { id },
    });
}

export async function findProductTypeByName(name) {
    return prisma.productType.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
}

export async function findProductTypeBySlug(slug) {
    return prisma.productType.findUnique({
        where: { slug },
    });
}

export async function createProductType(data) {
    return prisma.productType.create({
        data,
    });
}

export async function findProductTypes({
    skip,
    take,
    where,
    orderBy,
}) {
    return prisma.productType.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function countProductTypes(where) {
    return prisma.productType.count({
        where,
    });
}

export async function updateProductType(id, data) {
    return prisma.productType.update({
        where: { id },
        data,
    });
}

export async function deleteProductType(id) {
    return prisma.productType.delete({
        where: { id },
    });
}