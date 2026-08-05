import prisma from "../config/prisma.js";
import {  createInventoryAdjustment,  createInventoryAdjustmentItem,} from "../repositories/inventoryAdjustment.repository.js";
import {  findProductVariantById,  updateVariantStock,} from "../repositories/productVariant.repository.js";
import { createInventoryLedger } from "../repositories/inventory.repository.js";
import { generateBusinessNumber } from "../utils/businessNumber.js";

export async function createInventoryAdjustmentService(user, body) {
  const adjustmentNumber = await generateBusinessNumber("ADJ", {
    includeYear: true,
  });

  return prisma.$transaction(async (tx) => {
    const adjustment = await createInventoryAdjustment(
      {
        adjustmentNumber,
        reason: body.reason,
        notes: body.notes,
        createdById: user.id,
      },
      tx
    );

    for (const item of body.items) {
      const variant = await findProductVariantById(
        item.productVariantId,
        tx
      );

      if (!variant) {
        throw new Error("Product variant not found.");
      }

      const previousStock = variant.stock;
      const adjustedStock = item.adjustedStock;
      const difference = adjustedStock - previousStock;

      // Update stock
      await updateVariantStock(
        variant.id,
        adjustedStock,
        tx
      );

      // Save adjustment item
      await createInventoryAdjustmentItem(
        {
          adjustmentId: adjustment.id,
          productVariantId: variant.id,
          previousStock,
          adjustedStock,
          difference,
        },
        tx
      );

      // Create inventory ledger entry
      await createInventoryLedger(
        {
          productVariantId: variant.id,
          type: "ADJUSTMENT",
          quantity: difference,
          referenceId: adjustment.id,
          notes: body.notes,
          createdById: user.id,
        },
        tx
      );
    }

    return adjustment;
  });
}