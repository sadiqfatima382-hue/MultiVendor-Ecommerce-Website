import prisma from "../config/prisma.js";

export async function findproductSizeById(id) {
    return prisma.productSize.findUnique({
        where: { id },
    });
}

export async function findproductSizeByName(name) {
    return prisma.productSize.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
}

export async function createproductSize(data) {
    return prisma.productSize.create({
        data,
    });
}

export async function findproductSizes({
    skip,
    take,
    where,
    orderBy,
}) {
    return prisma.productSize.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
            id: true,
            name: true,
            Size:true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function countproductSizes(where) {
    return prisma.productSize.count({
        where,
    });
}

export async function updateproductSize(id, data) {
    return prisma.productSize.update({
        where: { id },
        data,
    });
}

export async function deleteproductSize(id) {
    return prisma.productSize.delete({
        where: { id },
    });
}