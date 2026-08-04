import { createPurchase, findPurchaseById, findPurchaseByNumber, updatePurchase, deletePurchase, addPurchaseItem, updatePurchaseItem, removePurchaseItem, findPurchaseItemById, getPurchaseItems, } from "../repositories/purchase.repository.js";
import { findSupplierById } from "../repositories/supplier.repository.js";
import { findVendorByOwnerId } from "../repositories/vendor.repository.js";
import { findProductById } from "../repositories/product.repository.js";
import { findProductVariantById } from "../repositories/productVariant.repository.js";
import { generateBusinessNumber } from "../utils/businessNumber.js";

// await prisma.$transaction(async (tx) => {
async function calculatePurchaseTotals(
  purchaseId
) {

  const items =
    await getPurchaseItems(purchaseId);

  const subtotal =
    items.reduce(
      (sum, item) =>
        sum + Number(item.total),
      0
    );

  const purchase =
    await findPurchaseById(purchaseId);

  const discount =
    Number(purchase.discount);

  const tax =
    Number(purchase.tax);

  const shipping =
    Number(purchase.shipping);

  const grandTotal =
    subtotal -
    discount +
    tax +
    shipping;

  await updatePurchase(
    purchaseId,
    {
      subtotal,
      grandTotal,
    }
  );

}

async function verifyPurchaseOwnership(user, purchase) {
  if (user.role.name !== "VENDOR") return;

  const vendor = await findVendorByOwnerId(user.id);

  if (!vendor || purchase.vendorId !== vendor.id) {
    throw new Error("Access denied.");
  }
}

function ensureDraftPurchase(purchase) {
  if (!purchase) {
    throw new Error("Purchase not found.");
  }

  if (purchase.status !== "DRAFT") {
    throw new Error(
      "Only draft purchases can be modified."
    );
  }
}

export async function createPurchaseService(user, body) {
  const supplier = await findSupplierById(body.supplierId);

  if (!supplier) {
    throw new Error("Supplier not found.");
  }

  const purchaseNumber = await generateBusinessNumber("PUR", {
    includeYear: true,
  });

  const data = {
    purchaseNumber,
    supplierId: body.supplierId,
    purchaseType:
      user.role.name === "SUPER_ADMIN"
        ? "ADMIN"
        : "VENDOR",
    createdById: user.id,
    notes: body.notes,
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    grandTotal: 0,
  };

  if (user.role.name === "VENDOR") {
    const vendor = await findVendorByOwnerId(user.id);

    if (!vendor) {
      throw new Error("Vendor not found.");
    }

    data.vendorId = vendor.id;
  }

  return createPurchase(data);
}

export async function addPurchaseItemService(
  user,
  purchaseId,
  body
) {
  const purchase = await findPurchaseById(purchaseId);

  if (!purchase) {
    throw new Error("Purchase not found.");
  }

  ensureDraftPurchase(purchase);

  await verifyPurchaseOwnership(user, purchase);

  const product = await findProductById(body.productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  const variant = await findProductVariantById(
    body.productVariantId
  );

  if (!variant) {
    throw new Error("Product variant not found.");
  }

  // New validation
  if (variant.productId !== product.id) {
    throw new Error(
      "Selected variant does not belong to the selected product."
    );
  }

  const total =
    Number(body.unitCost) *
    Number(body.quantity);

  const item = await addPurchaseItem({
    purchaseId,
    productId: body.productId,
    productVariantId: body.productVariantId,
    quantity: body.quantity,
    unitCost: body.unitCost,
    total,
  });

  await calculatePurchaseTotals(purchaseId);

  return item;
}

export async function updatePurchaseItemService(
  user,
  itemId,
  body
) {
  const item = await findPurchaseItemById(itemId);

  if (!item) {
    throw new Error("Purchase item not found.");
  }

  const purchase = await findPurchaseById(item.purchaseId);

  if (!purchase) {
    throw new Error("Purchase not found.");
  }

  ensureDraftPurchase(purchase);

  await verifyPurchaseOwnership(user, purchase);

  const updatedData = {};

  if (body.quantity !== undefined) {
    updatedData.quantity = body.quantity;
  }

  if (body.unitCost !== undefined) {
    updatedData.unitCost = body.unitCost;
  }

  const quantity =
    body.quantity ?? item.quantity;

  const unitCost =
    Number(body.unitCost ?? item.unitCost);

  updatedData.total =
    quantity * unitCost;

  const updatedItem =
    await updatePurchaseItem(item.id, updatedData);

  await calculatePurchaseTotals(purchase.id);

  return updatedItem;
}

export async function removePurchaseItemService(
  user,
  itemId
) {
  const item = await findPurchaseItemById(itemId);

  if (!item) {
    throw new Error("Purchase item not found.");
  }

  const purchase = await findPurchaseById(item.purchaseId);

  if (!purchase) {
    throw new Error("Purchase not found.");
  }

  ensureDraftPurchase(purchase);

  await verifyPurchaseOwnership(user, purchase);

  await removePurchaseItem(item.id);

  await calculatePurchaseTotals(purchase.id);
}

export async function updatePurchaseService(
  user,
  purchaseId,
  body
) {
  const purchase = await findPurchaseById(purchaseId);

  if (!purchase) {
    throw new Error("Purchase not found.");
  }

  ensureDraftPurchase(purchase);

  await verifyPurchaseOwnership(user, purchase);

  if (body.supplierId) {
    const supplier = await findSupplierById(body.supplierId);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }
  }

  const updatedPurchase = await updatePurchase(
    purchaseId,
    body
  );

  await calculatePurchaseTotals(purchaseId);

  return updatedPurchase;
}

export async function deletePurchaseService(
  user,
  purchaseId
) {
  const purchase = await findPurchaseById(purchaseId);

  if (!purchase) {
    throw new Error("Purchase not found.");
  }

  ensureDraftPurchase(purchase);

  await verifyPurchaseOwnership(user, purchase);

  await deletePurchase(purchaseId);

  return {
    message: "Purchase deleted successfully.",
  };
}

export async function submitPurchaseService(
  user,
  purchaseId
) {
  const purchase = await findPurchaseById(purchaseId);

  if (!purchase) {
    throw new Error("Purchase not found.");
  }

  ensureDraftPurchase(purchase);

  await verifyPurchaseOwnership(user, purchase);

  const items = await getPurchaseItems(purchaseId);

  if (items.length === 0) {
    throw new Error(
      "Purchase must contain at least one item."
    );
  }

  return updatePurchase(purchaseId, {
    status: "SUBMITTED",
  });
}
