import prisma from "../config/prisma.js"

export async function createGoodsReceipt(data, db = prisma) {
    return db.goodsReceipt.create({
        data,
        include: {
            items: true,
            purchase: true,
        }
    });
}

export async function findGoodsReceiptById(data, db = prisma) {
    return db.goodsReceipt.findUnique({
        where: { id },
        include: {
            items: true,
            purchase: true
        }
    });
}

//Receipt Items
export async function createGoodsReceiptItem(data, db = prisma) {
    return db.goodsReceiptItem.create({
        data,
    });
}
