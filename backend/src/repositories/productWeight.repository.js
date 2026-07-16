import prisma from "../config/prisma.js"

export async function findProductWeightById(id) {
    return await prisma.ProductWeight.findUnique({
        where: (id),
        include: { variants: true, }

    });

};

export async function findProductWeight(value, unit) {
    return await prisma.ProductWeight.findFirst({
        where: {
            value,
            unit,
        }
    });
};

export async function createProductWeight(data) {
    return await prisma.ProductWeight.create(
        {
            data,
        }
    )
}

export async function findProductWeights({ skip, take, where, orderBy, }) {
    return await prisma.ProductWeight.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
            value: true,
            unit: true,
        },
    });

}

export async function countProductWeights(where) {
    return await prisma.ProductWeight.count({
        where,
    })
}

export async function updateProductWeight(id, data) {
    return prisma.ProductWeight.update({
        where: { id },
        data,
    });
}

export async function deleteProductWeight(id) {
    return prisma.ProductWeight.delete({
        where: {
            id,
        }
    })
}