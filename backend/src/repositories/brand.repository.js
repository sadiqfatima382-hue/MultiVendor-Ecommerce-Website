import prisma from "../config/prisma.js";

export async function findBrandById(id) {
    return prisma.productBrand.findUnique({
        where: { id },
    });
}

export async function findBrandByName(name) {
    return prisma.productBrand.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
}

export async function findBrandBySlug(slug) {
    return prisma.productBrand.findUnique({
        where: { slug },
    });
}

export async function createBrand(data) {
    return prisma.productBrand.create({
        data,
    });
}

export async function findBrands({
    skip,
    take,
    where,
    orderBy,
}) {
    return prisma.productBrand.findMany({
        skip,
        take,
        where,
        orderBy,

        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logo: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function countBrands(where) {
    return prisma.productBrand.count({
        where,
    });
}

export async function updateBrand(id, data) {
    return prisma.productBrand.update({
        where: { id },
        data,
    });
}

export async function deleteBrand(id) {
    return prisma.productBrand.delete({
        where: { id },
    });
}