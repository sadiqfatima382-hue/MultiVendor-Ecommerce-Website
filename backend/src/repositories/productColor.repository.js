import prisma from "../config/prisma.js";

export async function findproductColorById(id) {
    return prisma.productColor.findUnique({
        where: { id },
    });
}

export async function findproductColorByName(name) {
    return prisma.productColor.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
}

export async function createproductColor(data) {
    return prisma.productColor.create({
        data,
    });
}

export async function findproductColors({
    skip,
    take,
    where,
    orderBy,
}) {
    return prisma.productColor.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
            id: true,
            name: true,
            color:true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function countproductColors(where) {
    return prisma.productColor.count({
        where,
    });
}

export async function updateproductColor(id, data) {
    return prisma.productColor.update({
        where: { id },
        data,
    });
}

export async function deleteproductColor(id) {
    return prisma.productColor.delete({
        where: { id },
    });
}