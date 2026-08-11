import prisma from "../config/prisma.js";

import {
  createCustomerReturn,
  findCustomerReturnById,
  findCustomerReturnByNumber,
  findCustomerReturns,
  countCustomerReturns,
  updateCustomerReturn,
  findOrderById,
  findOrderItemById,
  getReturnedQuantity,
} from "../repositories/customerReturn.repository.js";

import { getPagination } from "../utils/pagination.js";


// =====================================================
// RETURN NUMBER
// =====================================================

function generateReturnNumber() {
  const timestamp = Date.now();

  const random =
    Math.floor(
      1000 + Math.random() * 9000
    );

  return `RET-${timestamp}-${random}`;
}


// =====================================================
// CREATE CUSTOMER RETURN
// =====================================================

export async function createCustomerReturnService(
  userId,
  data
) {
  const {
    orderId,
    items,
    customerNotes,
  } = data;


  // ---------------------------------------------------
  // Find order
  // ---------------------------------------------------

  const order =
    await findOrderById(orderId);

  if (!order) {
    throw new Error(
      "Order not found."
    );
  }


  // ---------------------------------------------------
  // Verify ownership
  // ---------------------------------------------------

  if (order.userId !== userId) {
    throw new Error(
      "You are not allowed to return items from this order."
    );
  }


  // ---------------------------------------------------
  // Order status
  // ---------------------------------------------------

  const allowedStatuses = [
    "DELIVERED",
    "COMPLETED",
  ];

  if (
    !allowedStatuses.includes(
      order.status
    )
  ) {
    throw new Error(
      "Only delivered or completed orders can be returned."
    );
  }


  // ---------------------------------------------------
  // Items required
  // ---------------------------------------------------

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new Error(
      "At least one item is required."
    );
  }


  // ---------------------------------------------------
  // Prevent duplicate order items
  // ---------------------------------------------------

  const itemIds =
    items.map(
      (item) => item.orderItemId
    );

  if (
    new Set(itemIds).size !==
    itemIds.length
  ) {
    throw new Error(
      "Duplicate order items are not allowed."
    );
  }


  // ---------------------------------------------------
  // Validate every item
  // ---------------------------------------------------

  const returnItems = [];

  let totalRefund = 0;


  for (const item of items) {
    const {
      orderItemId,
      quantity,
      reason,
      reasonNotes,
    } = item;


    // -----------------------------------------------
    // Quantity
    // -----------------------------------------------

    const requestedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        requestedQuantity
      ) ||
      requestedQuantity <= 0
    ) {
      throw new Error(
        "Return quantity must be a positive integer."
      );
    }


    // -----------------------------------------------
    // Find order item
    // -----------------------------------------------

    const orderItem =
      await findOrderItemById(
        orderItemId
      );

    if (!orderItem) {
      throw new Error(
        `Order item ${orderItemId} not found.`
      );
    }


    // -----------------------------------------------
    // Verify item belongs to order
    // -----------------------------------------------

    const belongsToOrder =
      order.vendorOrders.some(
        (vendorOrder) =>
          vendorOrder.orderItems.some(
            (existingItem) =>
              existingItem.id ===
              orderItemId
          )
      );

    if (!belongsToOrder) {
      throw new Error(
        `Order item ${orderItemId} does not belong to this order.`
      );
    }


    // -----------------------------------------------
    // Already returned
    // -----------------------------------------------

    const alreadyReturned =
      await getReturnedQuantity(
        orderItemId
      );


    // -----------------------------------------------
    // Maximum returnable
    // -----------------------------------------------

    const remainingQuantity =
      orderItem.quantity -
      alreadyReturned;


    if (
      requestedQuantity >
      remainingQuantity
    ) {
      throw new Error(
        `Only ${remainingQuantity} item(s) can be returned for ${orderItem.productName}.`
      );
    }


    // -----------------------------------------------
    // Refund
    // -----------------------------------------------

    const unitPrice =
      Number(orderItem.price);

    const itemRefund =
      unitPrice *
      requestedQuantity;


    totalRefund +=
      itemRefund;


    returnItems.push({
      orderItemId:
        orderItem.id,

      productId:
        orderItem.productId,

      productVariantId:
        orderItem.productVariantId,

      quantity:
        requestedQuantity,

      reason,

      reasonNotes:
        reasonNotes?.trim() ||
        null,

      refundAmount:
        itemRefund,
    });
  }


  // ---------------------------------------------------
  // Generate unique return number
  // ---------------------------------------------------

  let returnNumber =
    generateReturnNumber();

  while (
    await findCustomerReturnByNumber(
      returnNumber
    )
  ) {
    returnNumber =
      generateReturnNumber();
  }


  // ---------------------------------------------------
  // Create return
  // ---------------------------------------------------

  return prisma.$transaction(
    async (tx) => {

      const customerReturn =
        await createCustomerReturn(
          {
            returnNumber,

            user: {
              connect: {
                id: userId,
              },
            },

            order: {
              connect: {
                id: orderId,
              },
            },

            customerNotes:
              customerNotes?.trim() ||
              null,

            refundAmount:
              totalRefund,

            items: {
              create:
                returnItems,
            },
          },
          tx
        );

      return customerReturn;
    }
  );
}


// =====================================================
// GET CUSTOMER RETURN BY ID
// =====================================================

export async function getCustomerReturnByIdService(
  returnId,
  userId,
  isAdmin = false
) {
  const customerReturn =
    await findCustomerReturnById(
      returnId
    );

  if (!customerReturn) {
    throw new Error(
      "Customer return not found."
    );
  }


  if (
    !isAdmin &&
    customerReturn.userId !== userId
  ) {
    throw new Error(
      "You are not allowed to view this return."
    );
  }


  return customerReturn;
}


// =====================================================
// GET CUSTOMER RETURNS
// =====================================================

export async function getCustomerReturnsService({
  userId,
  isAdmin = false,
  page = 1,
  limit = 10,
  status,
}) {
  const {
    skip,
    take,
  } = getPagination(
    page,
    limit
  );


  const where = {};


  // ---------------------------------------------------
  // Customer can only see own returns
  // ---------------------------------------------------

  if (!isAdmin) {
    where.userId =
      userId;
  }


  // ---------------------------------------------------
  // Status filter
  // ---------------------------------------------------

  if (status) {
    where.status =
      status;
  }


  const [
    returns,
    total,
  ] = await Promise.all([
    findCustomerReturns({
      skip,
      take,
      where,

      orderBy: {
        createdAt: "desc",
      },
    }),

    countCustomerReturns(
      where
    ),
  ]);


  return {
    returns,

    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,

      totalPages:
        Math.ceil(
          total /
            Number(limit)
        ),
    },
  };
}


// =====================================================
// APPROVE RETURN
// =====================================================

export async function approveCustomerReturnService(
  returnId,
  adminNotes
) {
  const customerReturn =
    await findCustomerReturnById(
      returnId
    );


  if (!customerReturn) {
    throw new Error(
      "Customer return not found."
    );
  }


  if (
    customerReturn.status !==
    "REQUESTED"
  ) {
    throw new Error(
      "Only requested returns can be approved."
    );
  }


  return updateCustomerReturn(
    returnId,
    {
      status: "APPROVED",

      approvedAt:
        new Date(),

      adminNotes:
        adminNotes?.trim() ||
        null,
    }
  );
}


// =====================================================
// REJECT RETURN
// =====================================================

export async function rejectCustomerReturnService(
  returnId,
  adminNotes
) {
  const customerReturn =
    await findCustomerReturnById(
      returnId
    );


  if (!customerReturn) {
    throw new Error(
      "Customer return not found."
    );
  }


  if (
    customerReturn.status !==
    "REQUESTED"
  ) {
    throw new Error(
      "Only requested returns can be rejected."
    );
  }


  if (
    !adminNotes?.trim()
  ) {
    throw new Error(
      "A rejection reason is required."
    );
  }


  return updateCustomerReturn(
    returnId,
    {
      status: "REJECTED",

      rejectedAt:
        new Date(),

      adminNotes:
        adminNotes.trim(),
    }
  );
}


// =====================================================
// MARK AS RECEIVED
// =====================================================

export async function receiveCustomerReturnService(
  returnId, adminUserId
) {
  const customerReturn =
    await findCustomerReturnById(
      returnId
    );


  if (!customerReturn) {
    throw new Error(
      "Customer return not found."
    );
  }


  if (
    customerReturn.status !==
    "APPROVED"
  ) {
    throw new Error(
      "Only approved returns can be marked as received."
    );
  }


  return prisma.$transaction(
    async (tx) => {

      // ---------------------------------------------
      // Update return status
      // ---------------------------------------------

      const updatedReturn =
        await updateCustomerReturn(
          returnId,
          {
            status:
              "RECEIVED",

            receivedAt:
              new Date(),
          },
          tx
        );


      // ---------------------------------------------
      // Add returned stock
      // ---------------------------------------------

      for (
        const item of
        customerReturn.items
      ) {

        await tx.inventoryLedger.create({
          data: {
            productVariantId:
              item.productVariantId,

            type:
              "SALE_RETURN",

            quantity:
              item.quantity,

            referenceId:
              customerReturn.id,

            notes:
              `Customer return ${customerReturn.returnNumber}`,

            createdById:
              customerReturn.userId,
          },
        });
      }


      return updatedReturn;
    }
  );
}


// =====================================================
// PROCESS REFUND
// =====================================================

export async function refundCustomerReturnService(
  returnId
) {
  const customerReturn =
    await findCustomerReturnById(
      returnId
    );


  if (!customerReturn) {
    throw new Error(
      "Customer return not found."
    );
  }


  if (
    customerReturn.status !==
    "RECEIVED"
  ) {
    throw new Error(
      "Only received returns can be refunded."
    );
  }


  if (
    !customerReturn.refundAmount
  ) {
    throw new Error(
      "Refund amount is not available."
    );
  }

  return updateCustomerReturn(
    returnId,
    {
      status:
        "REFUNDED",

      refundedAt:
        new Date(),
    }
  );
}


// =====================================================
// DELETE REQUESTED RETURN
// =====================================================

export async function deleteCustomerReturnService(
  returnId,
  userId,
  isAdmin = false
) {
  const customerReturn =
    await findCustomerReturnById(
      returnId
    );


  if (!customerReturn) {
    throw new Error(
      "Customer return not found."
    );
  }


  if (
    !isAdmin &&
    customerReturn.userId !== userId
  ) {
    throw new Error(
      "You are not allowed to delete this return."
    );
  }


  if (
    customerReturn.status !==
    "REQUESTED"
  ) {
    throw new Error(
      "Only requested returns can be deleted."
    );
  }


  return prisma.customerReturn.delete({
    where: {
      id: returnId,
    },
  });
}