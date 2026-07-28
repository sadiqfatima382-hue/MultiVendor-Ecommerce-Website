import prisma from "../config/prisma.js";
import { findVendorByOwnerId } from "../repositories/vendor.repository.js";
import { findVendorOrders, findVendorOrderById, updateVendorOrder, countIncompleteVendorOrders, } from "../repositories/vendorOrder.repository.js";
import { updateOrder } from "../repositories/order.repository.js";
import { findPaymentByOrderId, updatePayment, } from "../repositories/payment.repository.js";

const STATUS_FLOW = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    
    CONFIRMED: ["PROCESSING", "CANCELLED"],

    PROCESSING: ["SHIPPED", "CANCELLED"],

    SHIPPED: ["DELIVERED"],

    DELIVERED: ["RETURNED"],

    CANCELLED: [],

    RETURNED: [],
};

export async function getVendorOrdersService(userId) {
    const vendor = await findVendorByOwnerId(userId);

    if (!vendor) {
        throw new Error("Vendor not found.");
    }

    return await findVendorOrders(vendor.id);
}

export async function getVendorOrderByIdService(
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

    return vendorOrder;
}

export async function updateVendorOrderStatusService(
    vendorOrderId,
    userId,
    status
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
            "You are not authorized to update this order."
        );
    }

    const allowed = STATUS_FLOW[vendorOrder.status] || [];

    if (!allowed.includes(status)) {
        throw new Error(
            `Cannot change status from ${vendorOrder.status} to ${status}.`
        );
    }

    return prisma.$transaction(async (tx) => {
        // Update vendor order
        const updatedVendorOrder = await updateVendorOrder(
            tx,
            vendorOrderId,
            {
                status,
            }
        );

        // If not delivered, we're done
        if (status !== "DELIVERED") {
            return updatedVendorOrder;
        }

        // Check whether other vendor orders are still pending
        const remaining = await countIncompleteVendorOrders(
            tx,
            vendorOrder.orderId
        );

        // If other vendors haven't delivered yet, stop here
        if (remaining > 0) {
            return updatedVendorOrder;
        }

        // All vendor orders delivered → update main order
        await updateOrder(tx, vendorOrder.orderId, {
            status: "DELIVERED",
        });

        // Update payment (if one exists)
        const payment = await findPaymentByOrderId(
            tx,
            vendorOrder.orderId
        );

        if (payment) {
            await updatePayment(tx, payment.id, {
                status: "COMPLETED",
            });
        }

        return updatedVendorOrder;
    });
}
