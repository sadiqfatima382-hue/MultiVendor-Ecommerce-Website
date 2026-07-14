import prisma from "../config/prisma.js";

export async function findproductBadgeById(id) {
    return prisma.productBadge.findUnique({
        where: { id },
    });
}

export async function findproductBadgeByName(name) {
    return prisma.productBadge.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
}

export async function findproductBadgeBySlug(slug) {
    return prisma.productBadge.findUnique({
        where: { slug },
    });
}

export async function createproductBadge(data) {
    return prisma.productBadge.create({
        data,
    });
}

export async function findproductBadges({
    skip,
    take,
    where,
    orderBy,
}) {
    return prisma.productBadge.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
            id: true,
            name: true,
            slug: true,
            color:true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function countproductBadges(where) {
    return prisma.productBadge.count({
        where,
    });
}

export async function updateproductBadge(id, data) {
    return prisma.productBadge.update({
        where: { id },
        data,
    });
}

export async function deleteproductBadge(id) {
    return prisma.productBadge.delete({
        where: { id },
    });
}