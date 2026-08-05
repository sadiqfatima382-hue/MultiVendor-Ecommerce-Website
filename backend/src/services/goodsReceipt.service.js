import prisma from "../config/prisma.js";
import { createGoodsReceipt, findGoodsReceiptById, createGoodsReceiptItem } from "../repositories/goodsReceipt.repository.js";
import { createInventoryLedger } from "../repositories/inventory.repository.js";
import { findPurchaseById, getPurchaseItems, updatePurchaseStatus } from "../repositories/purchase.repository.js"
import { increaseVariantStock } from "../repositories/productVariant.repository.js";
import { generateBusinessNumber } from "../utils/businessNumber.js";

function ensurePurchaseHasItems(items) {
    if (!items.length) {
        throw new Error("Purchase has no items")
    }
}

export async function receivePurchaseService(user, purchaseId, body) {
    const purchase = await findPurchaseById(purchaseId)
    if (!purchase) {
        throw new Error("Purchase not found")
    }

    if (purchase.status !== "APPROVED") {
        throw new Error("Only approved purchase can be received")
    }

    const items =  await getPurchaseItems(    purchase.id  );

ensurePurchaseHasItems(items);

const receiptNumber= await generateBusinessNumber("GRN",
{
    includeYear:true,
}
);

return prisma.$transaction(async (tx) => {
    const receipt =
  await createGoodsReceipt(
    {
      receiptNumber,

      purchaseId:
        purchase.id,

      receivedById:
        user.id,

      notes:
        body.notes,
    },
    tx
  );

  for (const item of items) {
    await createGoodsReceiptItem(
  {
    goodsReceiptId:
      receipt.id,

    purchaseItemId:
      item.id,

    quantityReceived:
      item.quantity,
  },
  tx
);
await increaseVariantStock(
  item.productVariantId,

  item.quantity,

  tx
);
await createInventoryLedger(
  {
    productVariantId:
      item.productVariantId,

    type:
      "PURCHASE_RECEIVED",

    quantity:
      item.quantity,

    referenceId:
      receipt.id,

    notes:
      body.notes,

    createdById:
      user.id,
  },
  tx
);
  }
  await updatePurchaseStatus(
  purchase.id,
  {
    status:
      "RECEIVED",
  },
  tx
);

return receipt;
})
}