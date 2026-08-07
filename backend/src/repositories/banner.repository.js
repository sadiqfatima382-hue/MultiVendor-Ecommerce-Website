import prisma from "../config/prisma.js";

export async function createBanner(data, db = prisma) {
    return db.banner.create({
        data,
    });
}

export async function findBannerById(id, db = prisma) {
    return db.banner.findUnique({
        where: {
            id,
        },
    });
}

export async function findBanners({
    skip,
    take,
    where,
    orderBy,
    db = prisma,
}) {
    return db.banner.findMany({
        skip,
        take,
        where,
        orderBy,
    });
}

export async function countBanners(
    where,
    db = prisma
) {
    return db.banner.count({
        where,
    });
}

export async function updateBanner(
    id,
    data,
    db = prisma
) {
    return db.banner.update({
        where: {
            id,
        },
        data,
    });
}

export async function deleteBanner(
    id,
    db = prisma
) {
    return db.banner.delete({
        where: {
            id,
        },
    });
}