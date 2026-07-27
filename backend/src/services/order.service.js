import prisma from "../config/prisma.js";
import { createOrder, createVendorOrder, createOrderItem, decrementVariantStock, clearCart, findOrderById, findOrdersByUser} from "../repositories/order.repository.js";
import { getCheckoutSummaryService } from "./checkout.service.js";
import { findCheckoutCart } from "../repositories/checkout.repository.js";

export async function createOrderService(userId, paymentMethod, addressId) {
    // Get validated checkout summary
    const checkout = await getCheckoutSummaryService(userId, addressId);

    // Get user's cart
    const cart = await findCheckoutCart(userId);

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty.");
    }

    // Start transaction
    return prisma.$transaction(async (tx) => {
        // Create main order
        const order = await createOrder(tx, {
            userId,
            addressId: checkout.address.id,

            subtotal: checkout.summary.subtotal,
            shipping: checkout.summary.shipping,
            discount: checkout.summary.discount,
            tax: checkout.summary.tax,
            grandTotal: checkout.summary.grandTotal,

            paymentMethod,
            paymentStatus: "PENDING",
            status: "PENDING",
        });

        // Create vendor orders
        for (const vendorData of checkout.vendors) {
            const vendorOrder = await createVendorOrder(tx, {
                orderId: order.id,
                vendorId: vendorData.vendor.id,

                subtotal: vendorData.subtotal,

                status: "PENDING",
            });

            // Create order items
            for (const item of vendorData.items) {
                await createOrderItem(tx, {
                    vendorOrderId: vendorOrder.id,

                    productId: item.productVariant.product.id,
                    productVariantId: item.productVariant.id,

                    productName: item.productVariant.product.name,
                    productSku: item.productVariant.sku,

                    quantity: item.quantity,
                    price: item.productVariant.price,

                    total:
                        Number(item.productVariant.price) *
                        item.quantity,
                });

                // Reduce stock
                await decrementVariantStock(
                    tx,
                    item.productVariant.id,
                    item.quantity
                ); {
                    const stockUpdated = await decrementVariantStock(
                        tx,
                        item.productVariant.id,
                        item.quantity
                    );

                    if (stockUpdated.count === 0) {
                        throw new Error(
                            `${item.productVariant.product.name} no longer has sufficient stock. Please review your cart and try again.`
                        );
                    }
                }
            }
        }

        // Clear customer's cart
        await clearCart(tx, cart.id);

        // Return response
        return {
            orderId: order.id,
            message: "Order placed successfully.",
        };
    });
}
    export async function getOrdersService(userId) {
  return await findOrdersByUser(userId);
}

export async function getOrderByIdService(
  userId,
  orderId
) {
  const order = await findOrderById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.userId !== userId) {
    throw new Error(
      "You are not authorized to access this order."
    );
  }

  return order;
}
