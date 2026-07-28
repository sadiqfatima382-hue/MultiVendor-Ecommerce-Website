import prisma from "../config/prisma.js";

export async function createInvoice(data) {
  return prisma.invoice.create({
    data,
  });
}

export async function findInvoiceById(id) {
  return prisma.invoice.findUnique({
    where: {
      id,
    },
    include: {
      order: {
        include: {
          address: true,

          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          vendorOrders: {
            include: {
              vendor: true,

              items: {
                include: {
                  product: true,
                  productVariant: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function findInvoiceByOrderId(orderId) {
  return prisma.invoice.findUnique({
    where: {
      orderId,
    },
  });
}

export async function updateInvoice(id, data) {
  return prisma.invoice.update({
    where: {
      id,
    },
    data,
  });
}