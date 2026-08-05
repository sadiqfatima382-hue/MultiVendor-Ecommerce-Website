import prisma from "../config/prisma.js"

export async function createInventoryLedger(data, db = prisma) {
    return db.inventoryLedger.create({
        data,
    });
}
