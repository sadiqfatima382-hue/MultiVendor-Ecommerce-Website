import prisma from "../config/prisma.js";
import {  createOrder,  createVendorOrder,  createOrderItem,  decrementVariantStock,  clearCart,  findOrderById,  findOrdersByUser,  updateOrder,} from "../repositories/order.repository.js";
import { getCheckoutSummaryService } from "./checkout.service.js";
import { findCheckoutCart } from "../repositories/checkout.repository.js";
import { getIO } from "../sockets/socket.js";

// ======================================================
// CREATE ORDER
// ======================================================

export async function createOrderService(
  userId,
  paymentMethod,
  addressId
) {
  // Get validated checkout summary
  const checkout =
    await getCheckoutSummaryService(
      userId,
      addressId
    );

  // Get user's cart
  const cart =
    await findCheckoutCart(userId);

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty.");
  }

  // ====================================================
  // DATABASE TRANSACTION
  // ====================================================

  const result = await prisma.$transaction(
    async (tx) => {

      // ----------------------------------------------
      // Create main order
      // ----------------------------------------------

      const order = await createOrder(tx, {
        userId,

        addressId:
          checkout.address.id,

        subtotal:
          checkout.summary.subtotal,

        shipping:
          checkout.summary.shipping,

        discount:
          checkout.summary.discount,

        tax:
          checkout.summary.tax,

        grandTotal:
          checkout.summary.grandTotal,

        paymentMethod,

        paymentStatus: "PENDING",

        status: "PENDING",
      });


      // ----------------------------------------------
      // Create vendor orders
      // ----------------------------------------------

      for (const vendorData of checkout.vendors) {

        const vendorOrder =
          await createVendorOrder(tx, {

            orderId:
              order.id,

            vendorId:
              vendorData.vendor.id,

            subtotal:
              vendorData.subtotal,

            status:
              "PENDING",
          });


        // --------------------------------------------
        // Create order items
        // --------------------------------------------

        for (const item of vendorData.items) {

          await createOrderItem(tx, {

            vendorOrderId:
              vendorOrder.id,

            productId:
              item.productVariant.product.id,

            productVariantId:
              item.productVariant.id,

            productName:
              item.productVariant.product.name,

            productSku:
              item.productVariant.sku,

            quantity:
              item.quantity,

            price:
              item.productVariant.price,

            total:
              Number(
                item.productVariant.price
              ) * item.quantity,
          });


          // ------------------------------------------
          // Reduce stock
          // ------------------------------------------

          const stockUpdated =
            await decrementVariantStock(
              tx,
              item.productVariant.id,
              item.quantity
            );


          // ------------------------------------------
          // Check stock
          // ------------------------------------------

          if (stockUpdated.count === 0) {

            throw new Error(
              `${item.productVariant.product.name} no longer has sufficient stock. Please review your cart and try again.`
            );
          }
        }
      }


      // ----------------------------------------------
      // Clear customer's cart
      // ----------------------------------------------

      await clearCart(
        tx,
        cart.id
      );


      // ----------------------------------------------
      // Return transaction result
      // ----------------------------------------------

      return {
        orderId:
          order.id,

        vendors:
          checkout.vendors,

        message:
          "Order placed successfully.",
      };
    }
  );


  // ==================================================
  // SOCKET.IO EVENTS
  // ==================================================

  const io = getIO();


  // ==================================================
  // CUSTOMER EVENT
  // ==================================================

  io.to(`user:${userId}`).emit(
    "order:created",
    {
      orderId:
        result.orderId,

      message:
        "Your order has been placed successfully.",
    }
  );


  // ==================================================
  // ADMIN EVENT
  // ==================================================

  io.to("admin").emit(
    "order:new",
    {
      orderId:
        result.orderId,

      customerId:
        userId,

      message:
        "A new order has been placed.",
    }
  );


  // ==================================================
  // VENDOR EVENTS
  // ==================================================

  for (
    const vendorData
    of result.vendors
  ) {

    io.to(
      `vendor:${vendorData.vendor.id}`
    ).emit(
      "vendor:order:new",
      {
        orderId:
          result.orderId,

        vendorId:
          vendorData.vendor.id,

        message:
          "You have received a new order.",
      }
    );
  }


  // ==================================================
  // RETURN RESPONSE
  // ==================================================

  return {
    orderId:
      result.orderId,

    message:
      result.message,
  };
}


// ======================================================
// GET USER ORDERS
// ======================================================

export async function getOrdersService(
  userId
) {
  return await findOrdersByUser(
    userId
  );
}


// ======================================================
// GET ORDER BY ID
// ======================================================

export async function getOrderByIdService(
  userId,
  orderId
) {
  const order =
    await findOrderById(orderId);


  if (!order) {
    throw new Error(
      "Order not found."
    );
  }


  if (
    order.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to access this order."
    );
  }


  return order;
}


// ======================================================
// UPDATE ORDER STATUS
// ======================================================

export async function updateOrderStatusService(
  orderId,
  status
) {
  // ----------------------------------------------
  // Find order
  // ----------------------------------------------

  const order =
    await findOrderById(orderId);


  if (!order) {
    throw new Error(
      "Order not found."
    );
  }


  // ----------------------------------------------
  // Update database FIRST
  // ----------------------------------------------

  const updatedOrder =
    await updateOrder(
      orderId,
      {
        status,
      }
    );


  // ----------------------------------------------
  // Socket.IO
  // ----------------------------------------------

  const io = getIO();


  // ----------------------------------------------
  // Notify everyone inside order room
  // ----------------------------------------------

  io.to(`order:${orderId}`).emit(
    "order:status-updated",
    {
      orderId:
        updatedOrder.id,

      orderNumber:
        updatedOrder.orderNumber,

      status:
        updatedOrder.status,

      paymentStatus:
        updatedOrder.paymentStatus,

      updatedAt:
        updatedOrder.updatedAt,
    }
  );


  // ----------------------------------------------
  // Notify customer
  // ----------------------------------------------

  io.to(`user:${order.userId}`).emit(
    "order:status-updated",
    {
      orderId:
        updatedOrder.id,

      orderNumber:
        updatedOrder.orderNumber,

      status:
        updatedOrder.status,

      paymentStatus:
        updatedOrder.paymentStatus,

      updatedAt:
        updatedOrder.updatedAt,
    }
  );


  // ----------------------------------------------
  // Notify admin
  // ----------------------------------------------

  io.to("admin").emit(
    "order:status-updated",
    {
      orderId:
        updatedOrder.id,

      orderNumber:
        updatedOrder.orderNumber,

      status:
        updatedOrder.status,

      paymentStatus:
        updatedOrder.paymentStatus,

      updatedAt:
        updatedOrder.updatedAt,
    }
  );


  // ----------------------------------------------
  // Return updated order
  // ----------------------------------------------

  return updatedOrder;
}