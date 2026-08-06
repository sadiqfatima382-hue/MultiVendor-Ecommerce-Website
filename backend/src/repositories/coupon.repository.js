import prisma from "../config/prisma.js";

export async function createCoupon(data, db=prisma){
    return db.coupon.create({
        data,
    })
}

export async function findCouponById(id, db = prisma) {
  return db.coupon.findUnique({
    where: {
      id,
    },
  });
}

export async function findCouponByCode( code, db = prisma) {
  return db.coupon.findUnique({
    where: {
      code: code.toUpperCase(),
    },
  });
}

export async function getCoupons({skip = 0, take = 10,
    where = {},
    orderBy = {
      createdAt: "desc",
    },
  },
  db = prisma
) {
  return db.coupon.findMany({
    skip,
    take,
    where,
    orderBy,
  });
}

export async function countCoupons(
  where = {},
  db = prisma
) {
  return db.coupon.count({
    where,
  });
}

export async function updateCoupon(
  id,
  data,
  db = prisma
) {
  return db.coupon.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteCoupon(
  id,
  db = prisma
) {
  return db.coupon.delete({
    where: {
      id,
    },
  });
}

export async function incrementCouponUsage(
  id,
  db = prisma
) {
  return db.coupon.update({
    where: {
      id,
    },
    data: {
      usedCount: {
        increment: 1,
      },
    },
  });
}

export async function createCouponUsage(
  data,
  db = prisma
) {
  return db.couponUsage.create({
    data,
  });
}

export async function countCouponUsageByUser(
  couponId,
  userId,
  db = prisma
) {
  return db.couponUsage.count({
    where: {
      couponId,
      userId,
    },
  });
}

