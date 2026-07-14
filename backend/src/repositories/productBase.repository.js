import prisma from "../config/prisma.js";

export async function findproductBaseById(id) {
    return prisma.productBase.findUnique({
        where: { id },
    });
}

export async function findproductBaseByName(name) {
    return prisma.productBase.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
}

export async function findproductBaseBySlug(slug) {
    return prisma.productBase.findUnique({
        where: { slug },
    });
}

export async function createproductBase(data) {
    return prisma.productBase.create({
        data,
    });
}

export async function findproductBases({
    skip,
    take,
    where,
    orderBy,
}) {
    return prisma.productBase.findMany({
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

export async function countproductBases(where) {
    return prisma.productBase.count({
        where,
    });
}

export async function updateproductBase(id, data) {
    return prisma.productBase.update({
        where: { id },
        data,
    });
}

export async function deleteproductBase(id) {
    return prisma.productBase.delete({
        where: { id },
    });
}