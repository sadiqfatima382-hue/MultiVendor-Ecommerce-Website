import {  createSubscriptionPlan,  findSubscriptionPlanById,  findSubscriptionPlanByName,  findSubscriptionPlans,  countSubscriptionPlans,  updateSubscriptionPlan,  deleteSubscriptionPlan,  createUserSubscription,  findUserSubscriptionById,  findUserSubscriptions,  countUserSubscriptions,  findActiveUserSubscription,  updateUserSubscription,  deleteUserSubscription,} from "../repositories/subscription.repository.js";
import {  findUserById,} from "../repositories/auth.repository.js";
import { getPagination } from "../utils/pagination.js";

// =====================================================
// SUBSCRIPTION PLAN
// =====================================================


// =====================================================
// CREATE PLAN
// =====================================================

export async function createSubscriptionPlanService(
  data
) {
  const {
    name,
    description,
    price,
    billingCycle,
    features,
    isActive = true,
  } = data;

  const normalizedName =
    name.trim();

  const existing =
    await findSubscriptionPlanByName(
      normalizedName
    );

  if (existing) {
    throw new Error(
      "Subscription plan with this name already exists."
    );
  }

  if (Number(price) < 0) {
    throw new Error(
      "Subscription price cannot be negative."
    );
  }

  return createSubscriptionPlan({
    name: normalizedName,
    description,
    price: Number(price),
    billingCycle,
    features,
    isActive,
  });
}


// =====================================================
// GET PLANS
// =====================================================

export async function getSubscriptionPlansService({
  page = 1,
  limit = 10,
  search,
  isActive,
  billingCycle,
  publicOnly = false,
}) {
  const { skip, take } =
    getPagination(page, limit);

  const where = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (billingCycle) {
    where.billingCycle =
      billingCycle;
  }

  if (isActive !== undefined) {
    where.isActive =
      isActive === true ||
      isActive === "true";
  }

  if (publicOnly) {
    where.isActive = true;
  }

  const [
    plans,
    total,
  ] = await Promise.all([
    findSubscriptionPlans({
      skip,
      take,
      where,
      orderBy: {
        createdAt: "desc",
      },
    }),

    countSubscriptionPlans(where),
  ]);

  return {
    plans,

    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages:
        Math.ceil(
          total / Number(limit)
        ),
    },
  };
}


// =====================================================
// GET PLAN BY ID
// =====================================================

export async function getSubscriptionPlanByIdService(
  id
) {
  const plan =
    await findSubscriptionPlanById(id);

  if (!plan) {
    throw new Error(
      "Subscription plan not found."
    );
  }

  return plan;
}


// =====================================================
// UPDATE PLAN
// =====================================================

export async function updateSubscriptionPlanService(
  id,
  data
) {
  const existing =
    await findSubscriptionPlanById(id);

  if (!existing) {
    throw new Error(
      "Subscription plan not found."
    );
  }

  const updateData = {};

  if (data.name !== undefined) {
    const normalizedName =
      data.name.trim();

    if (
      normalizedName !==
      existing.name
    ) {
      const duplicate =
        await findSubscriptionPlanByName(
          normalizedName
        );

      if (duplicate) {
        throw new Error(
          "Subscription plan with this name already exists."
        );
      }

      updateData.name =
        normalizedName;
    }
  }

  if (data.description !== undefined) {
    updateData.description =
      data.description;
  }

  if (data.price !== undefined) {
    if (Number(data.price) < 0) {
      throw new Error(
        "Subscription price cannot be negative."
      );
    }

    updateData.price =
      Number(data.price);
  }

  if (
    data.billingCycle !==
    undefined
  ) {
    updateData.billingCycle =
      data.billingCycle;
  }

  if (data.features !== undefined) {
    updateData.features =
      data.features;
  }

  if (data.isActive !== undefined) {
    updateData.isActive =
      data.isActive;
  }

  return updateSubscriptionPlan(
    id,
    updateData
  );
}


// =====================================================
// DELETE PLAN
// =====================================================

export async function deleteSubscriptionPlanService(
  id
) {
  const existing =
    await findSubscriptionPlanById(id);

  if (!existing) {
    throw new Error(
      "Subscription plan not found."
    );
  }

  // ---------------------------------------------------
  // Don't allow deletion when subscriptions exist
  // ---------------------------------------------------

  const subscriptions =
    await countUserSubscriptions({
      planId: id,
    });

  if (subscriptions > 0) {
    throw new Error(
      "Subscription plan cannot be deleted because users are subscribed to it."
    );
  }

  return deleteSubscriptionPlan(id);
}


// =====================================================
// USER SUBSCRIPTIONS
// =====================================================


// =====================================================
// CREATE USER SUBSCRIPTION
// =====================================================

export async function createUserSubscriptionService(
  data
) {
  const {
    userId,
    planId,
  } = data;

  // ---------------------------------------------------
  // Check user
  // ---------------------------------------------------

  const user =
    await findUserById(userId);

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  // ---------------------------------------------------
  // Check plan
  // ---------------------------------------------------

  const plan =
    await findSubscriptionPlanById(
      planId
    );

  if (!plan) {
    throw new Error(
      "Subscription plan not found."
    );
  }

  if (!plan.isActive) {
    throw new Error(
      "Subscription plan is inactive."
    );
  }

  // ---------------------------------------------------
  // Prevent duplicate active subscription
  // ---------------------------------------------------

  const activeSubscription =
    await findActiveUserSubscription(
      userId
    );

  if (activeSubscription) {
    throw new Error(
      "User already has an active subscription."
    );
  }

  // ---------------------------------------------------
  // Calculate dates
  // ---------------------------------------------------

  const startDate = new Date();

  const endDate = new Date(
    startDate
  );

  if (
    plan.billingCycle ===
    "MONTHLY"
  ) {
    endDate.setMonth(
      endDate.getMonth() + 1
    );
  }

  if (
    plan.billingCycle ===
    "YEARLY"
  ) {
    endDate.setFullYear(
      endDate.getFullYear() + 1
    );
  }

  return createUserSubscription({
    userId,
    planId,

    status: "ACTIVE",

    startDate,
    endDate,
  });
}


// =====================================================
// GET USER SUBSCRIPTIONS
// =====================================================

export async function getUserSubscriptionsService({
  page = 1,
  limit = 10,
  userId,
  status,
}) {
  const { skip, take } =
    getPagination(page, limit);

  const where = {};

  if (userId) {
    where.userId = userId;
  }

  if (status) {
    where.status = status;
  }

  const [
    subscriptions,
    total,
  ] = await Promise.all([
    findUserSubscriptions({
      skip,
      take,
      where,
      orderBy: {
        createdAt: "desc",
      },
    }),

    countUserSubscriptions(where),
  ]);

  return {
    subscriptions,

    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages:
        Math.ceil(
          total / Number(limit)
        ),
    },
  };
}


// =====================================================
// GET USER SUBSCRIPTION BY ID
// =====================================================

export async function getUserSubscriptionByIdService(
  id
) {
  const subscription =
    await findUserSubscriptionById(
      id
    );

  if (!subscription) {
    throw new Error(
      "User subscription not found."
    );
  }

  return subscription;
}


// =====================================================
// GET CURRENT ACTIVE SUBSCRIPTION
// =====================================================

export async function getActiveUserSubscriptionService(
  userId
) {
  const subscription =
    await findActiveUserSubscription(
      userId
    );

  if (!subscription) {
    throw new Error(
      "User does not have an active subscription."
    );
  }

  return subscription;
}


// =====================================================
// CANCEL SUBSCRIPTION
// =====================================================

export async function cancelUserSubscriptionService(
  id
) {
  const subscription =
    await findUserSubscriptionById(
      id
    );

  if (!subscription) {
    throw new Error(
      "User subscription not found."
    );
  }

  if (
    subscription.status !==
    "ACTIVE"
  ) {
    throw new Error(
      "Only active subscriptions can be cancelled."
    );
  }

  return updateUserSubscription(
    id,
    {
      status: "CANCELLED",
      cancelledAt: new Date(),
    }
  );
}


// =====================================================
// EXPIRE SUBSCRIPTION
// =====================================================

export async function expireUserSubscriptionService(
  id
) {
  const subscription =
    await findUserSubscriptionById(
      id
    );

  if (!subscription) {
    throw new Error(
      "User subscription not found."
    );
  }

  if (
    subscription.status !==
    "ACTIVE"
  ) {
    throw new Error(
      "Only active subscriptions can expire."
    );
  }

  if (
    subscription.endDate &&
    subscription.endDate >
      new Date()
  ) {
    throw new Error(
      "Subscription has not reached its expiry date."
    );
  }

  return updateUserSubscription(
    id,
    {
      status: "EXPIRED",
    }
  );
}


// =====================================================
// DELETE USER SUBSCRIPTION
// =====================================================

export async function deleteUserSubscriptionService(
  id
) {
  const subscription =
    await findUserSubscriptionById(
      id
    );

  if (!subscription) {
    throw new Error(
      "User subscription not found."
    );
  }

  return deleteUserSubscription(id);
}