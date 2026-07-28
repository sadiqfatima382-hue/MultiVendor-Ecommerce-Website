import prisma from "../config/prisma.js";

import {
  createQualityControl,
  findQualityControlByVendorOrder,
  updateQualityControl,
} from "../repositories/qualityControl.repository.js";

import {
  findVendorOrderById,
  updateVendorOrder,
} from "../repositories/vendorOrder.repository.js";

import { findVendorByOwnerId } from "../repositories/vendor.repository.js";

export async function createQualityControlService(
  userId,
  vendorOrderId
) {
  const vendor = await findVendorByOwnerId(userId);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  const vendorOrder = await findVendorOrderById(vendorOrderId);

  if (!vendorOrder) {
    throw new Error("Vendor order not found.");
  }

  if (vendorOrder.vendorId !== vendor.id) {
    throw new Error("You are not authorized to access this order.");
  }

  if (vendorOrder.status !== "PROCESSING") {
    throw new Error(
      "Only processing orders can enter quality control."
    );
  }

  const existing = await findQualityControlByVendorOrder(
    vendorOrderId
  );

  if (existing) {
    throw new Error(
      "Quality control already exists for this order."
    );
  }

  return await createQualityControl({
    vendorOrderId,
    status: "PENDING",
  });
}

export async function getQualityControlService(
  userId,
  vendorOrderId
) {
  const vendor = await findVendorByOwnerId(userId);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  const vendorOrder = await findVendorOrderById(vendorOrderId);

  if (!vendorOrder) {
    throw new Error("Vendor order not found.");
  }

  if (vendorOrder.vendorId !== vendor.id) {
    throw new Error(
      "You are not authorized to access this order."
    );
  }

  const qc = await findQualityControlByVendorOrder(
    vendorOrderId
  );

  if (!qc) {
    throw new Error("Quality control not found.");
  }

  return qc;
}

export async function updateQualityControlService(
  userId,
  vendorOrderId,
  status,
  notes
) {
  const vendor = await findVendorByOwnerId(userId);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  const vendorOrder = await findVendorOrderById(vendorOrderId);

  if (!vendorOrder) {
    throw new Error("Vendor order not found.");
  }

  if (vendorOrder.vendorId !== vendor.id) {
    throw new Error(
      "You are not authorized to update this quality control."
    );
  }

  const qualityControl =
    await findQualityControlByVendorOrder(
      vendorOrderId
    );

  if (!qualityControl) {
    throw new Error("Quality control not found.");
  }

  return prisma.$transaction(async (tx) => {
    const qc = await updateQualityControl(
      tx,
      qualityControl.id,
      {
        status,
        notes,
      }
    );

    if (status === "PASSED") {
      await updateVendorOrder(tx, vendorOrderId, {
        status: "SHIPPED",
      });
    }

    if (status === "FAILED") {
      await updateVendorOrder(tx, vendorOrderId, {
        status: "PROCESSING",
      });
    }

    return qc;
  });
}