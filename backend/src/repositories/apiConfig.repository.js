import prisma from "../config/prisma.js";
export async function createApiConfig(
    data,
    db = prisma
) {
    return db.apiConfig.create({
        data,
    });
}

export async function findApiConfigById(
    id,
    db = prisma
) {
    return db.apiConfig.findUnique({
        where: {
            id,
        },
    });
}

export async function findApiConfigByName(
    name,
    db = prisma
) {
    return db.apiConfig.findUnique({
        where: {
            name,
        },
    });
}

export async function findApiConfigs({
    skip,
    take,
    where,
    orderBy,
    db = prisma,
}) {
    return db.apiConfig.findMany({
        skip,
        take,
        where,
        orderBy,
    });
}

export async function countApiConfigs(
    where,
    db = prisma
) {
    return db.apiConfig.count({
        where,
    });
}

export async function updateApiConfig(
    id,
    data,
    db = prisma
) {
    return db.apiConfig.update({
        where: {
            id,
        },
        data,
    });
}

export async function deleteApiConfig(
    id,
    db = prisma
) {
    return db.apiConfig.delete({
        where: {
            id,
        },
    });
}