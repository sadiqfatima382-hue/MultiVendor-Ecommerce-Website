import { updatePurchaseStatus } from "../repositories/purchase.repository";

function ensurePurchaseStatus(purchase, status) {
  if (purchase.status !== status) {
    throw new Error(
      `Purchase must be ${status.toLowerCase().replace("_", " ")}.`
    );
  }
}

export async function approvePurchaseService(
  user,
  purchaseId
) {
  const purchase = await findPurchaseById(purchaseId);

  if (!purchase) {
    throw new Error("Purchase not found.");
  }

  ensurePurchaseStatus(purchase, "PENDING");

  return await updatePurchaseStatus(
    purchase.id,
    {
      status: "APPROVED",
      approvedById: user.id,
      approvedAt: new Date(),
    }
  );
}

