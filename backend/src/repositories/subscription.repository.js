import prisma from "../config/prisma.js";

// =====================================================
// SUBSCRIPTION PLAN
// =====================================================

export async function createSubscriptionPlan(
  data,
  db = prisma
) {
  return db.subscriptionPlan.create({
    data,
  });
}

export async function findSubscriptionPlanById(
  id,
  db = prisma
) {
  return db.subscriptionPlan.findUnique({
    where: {
      id,
    },
  });
}

export async function findSubscriptionPlanByName(
  name,
  db = prisma
) {
  return db.subscriptionPlan.findUnique({
    where: {
      name,
    },
  });
}

export async function findSubscriptionPlans({
  skip,
  take,
  where,
  orderBy,
  db = prisma,
}) {
  return db.subscriptionPlan.findMany({
    skip,
    take,
    where,
    orderBy,
  });
}

export async function countSubscriptionPlans(
  where,
  db = prisma
) {
  return db.subscriptionPlan.count({
    where,
  });
}

export async function updateSubscriptionPlan(
  id,
  data,
  db = prisma
) {
  return db.subscriptionPlan.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteSubscriptionPlan(
  id,
  db = prisma
) {
  return db.subscriptionPlan.delete({
    where: {
      id,
    },
  });
}


// =====================================================
// USER SUBSCRIPTION
// =====================================================

export async function createUserSubscription(
  data,
  db = prisma
) {
  return db.userSubscription.create({
    data,
  });
}

export async function findUserSubscriptionById(
  id,
  db = prisma
) {
  return db.userSubscription.findUnique({
    where: {
      id,
    },
    include: {
      plan: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function findUserSubscriptions({
  skip,
  take,
  where,
  orderBy,
  db = prisma,
}) {
  return db.userSubscription.findMany({
    skip,
    take,
    where,
    orderBy,
    include: {
      plan: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function countUserSubscriptions(
  where,
  db = prisma
) {
  return db.userSubscription.count({
    where,
  });
}

export async function findActiveUserSubscription(
  userId,
  db = prisma
) {
  return db.userSubscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      OR: [
        {
          endDate: null,
        },
        {
          endDate: {
            gte: new Date(),
          },
        },
      ],
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateUserSubscription(
  id,
  data,
  db = prisma
) {
  return db.userSubscription.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteUserSubscription(
  id,
  db = prisma
) {
  return db.userSubscription.delete({
    where: {
      id,
    },
  });
}