import prisma from "../config/prisma.js";
import { createOrder, createVendorOrder, createOrderItem, decrementVariantStock, clearCart, findOrderById, findOrdersByUser, updateOrder, } from "../repositories/order.repository.js";
import { getCheckoutSummaryService } from "./checkout.service.js";
import { findCheckoutCart } from "../repositories/checkout.repository.js";
import { getIO } from "../sockets/socket.js";
import { notifyUser, notifyVendor, notifyAdmin } from "../utils/socketNotification.js";
import { types } from "pg";
import { queueEmail } from "../queues/email.job.js";
import { orderPlacedEmail, } from "../email/order.email.js";
// ======================================================
// CREATE ORDER
// ======================================================

export async function createOrderService(
  userId,
  paymentMethod,
  addressId
) {
  // ==================================================
  // GET CHECKOUT SUMMARY
  // ==================================================

  const checkout =
    await getCheckoutSummaryService(
      userId,
      addressId
    );

  // ==================================================
  // GET USER CART
  // ==================================================

  const cart =
    await findCheckoutCart(userId);

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty.");
  }

  // ==================================================
  // DATABASE TRANSACTION
  // ==================================================

  const result = await prisma.$transaction(
    async (tx) => {

      // ----------------------------------------------
      // CREATE MAIN ORDER
      // ----------------------------------------------

      const order =
        await createOrder(tx, {
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

          paymentStatus:
            "PENDING",

          status:
            "PENDING",
        });

      // ----------------------------------------------
      // CREATE VENDOR ORDERS
      // ----------------------------------------------

      for (
        const vendorData
        of checkout.vendors
      ) {

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
        // CREATE ORDER ITEMS
        // --------------------------------------------

        for (
          const item
          of vendorData.items
        ) {

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
          // DECREMENT STOCK
          // ------------------------------------------

          const stockUpdated =
            await decrementVariantStock(
              tx,
              item.productVariant.id,
              item.quantity
            );

          // ------------------------------------------
          // CHECK STOCK
          // ------------------------------------------

          if (
            stockUpdated.count === 0
          ) {
            throw new Error(
              `${item.productVariant.product.name} no longer has sufficient stock. Please review your cart and try again.`
            );
          }
        }
      }

      // ----------------------------------------------
      // CLEAR CART
      // ----------------------------------------------

      await clearCart(
        tx,
        cart.id
      );

      // ----------------------------------------------
      // RETURN TRANSACTION RESULT
      // ----------------------------------------------

      return {
        orderId:
          order.id,

        orderNumber:
          order.orderNumber,

        grandTotal:
          order.grandTotal,

        vendors:
          checkout.vendors,

        message:
          "Order placed successfully.",
      };
    }
  );

  // ==================================================
  // CUSTOMER EMAIL
  // ==================================================

  const customer =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        name: true,
        email: true,
      },
    });

  if (!customer) {
    throw new Error(
      "Customer not found."
    );
  }

  const email =
    orderPlacedEmail({
      customerName:
        customer.name,

      orderId:
        result.orderId,

      orderNumber:
        result.orderNumber,

      grandTotal:
        result.grandTotal,
    });

  await queueEmail({
    to:
      customer.email,

    subject:
      email.subject,

    text:
      email.text,

    html:
      email.html,
  });

  // ==================================================
  // SOCKET NOTIFICATIONS
  // ==================================================

  // Customer notification
  notifyUser(userId, {
    type:
      "ORDER_CREATED",

    title:
      "Order Placed",

    message:
      "Your order has been placed successfully.",

    orderId:
      result.orderId,
  });

  // Admin notification
  notifyAdmin({
    type:
      "NEW_ORDER",

    title:
      "New Order",

    message:
      "A new order has been placed.",

    orderId:
      result.orderId,

    customerId:
      userId,
  });

  // Vendor notifications
  for (
    const vendorData
    of result.vendors
  ) {

    notifyVendor(
      vendorData.vendor.id,
      {
        type:
          "NEW_ORDER",

        title:
          "New Order",

        message:
          "You have received a new order.",

        orderId:
          result.orderId,

        vendorId:
          vendorData.vendor.id,
      }
    );
  }

  // ==================================================
  // SOCKET.IO EVENTS
  // ==================================================

  const io = getIO();

  // ----------------------------------------------
  // CUSTOMER EVENT
  // ----------------------------------------------

  io.to(`user:${userId}`).emit(
    "order:created",
    {
      orderId:
        result.orderId,

      message:
        "Your order has been placed successfully.",
    }
  );

  // ----------------------------------------------
  // ADMIN EVENT
  // ----------------------------------------------

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

  // ----------------------------------------------
  // VENDOR EVENTS
  // ----------------------------------------------

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

  notifyUser(order.userId, {
    type: "ORDER_STATUS_UPDATED",
    title: "Order Status Updated",
    message: `Your order is now ${updatedOrder.status}.`,
    orderId: updatedOrder.id,
    status: updatedOrder.status,
  });

  notifyAdmin({
    type: "ORDER_STATUS_UPDATED",
    title: "Order Status Updated",
    message: `Order ${updatedOrder.orderNumber ?? updatedOrder.id} is now ${updatedOrder.status}.`,
    orderId: updatedOrder.id,
    status: updatedOrder.status,
  });


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