import prisma from "../config/prisma.js";

export async function createPayment(data) {
  return prisma.payment.create({
    data,
  });
}

export async function findPaymentById(id) {
 return prisma.payment.findUnique({
  where: {
    id,
  },
  include: {
    order: {
      select: {
        userId: true,
      },
    },
  },
});
}

export async function findPaymentByOrderId(orderId) {
  return prisma.payment.findFirst({
    where: {
      orderId,
    },
  });
}

export async function updatePayment(id, data) {
  return prisma.payment.update({
    where: {
      id,
    },
    data,
  });
}