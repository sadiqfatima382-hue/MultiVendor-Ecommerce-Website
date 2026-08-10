import {
  createSubscriptionPlanService,
  getSubscriptionPlansService,
  getSubscriptionPlanByIdService,
  updateSubscriptionPlanService,
  deleteSubscriptionPlanService,

  createUserSubscriptionService,
  getUserSubscriptionsService,
  getUserSubscriptionByIdService,
  getActiveUserSubscriptionService,
  cancelUserSubscriptionService,
  expireUserSubscriptionService,
  deleteUserSubscriptionService,
} from "../services/subscription.service.js";


// =====================================================
// SUBSCRIPTION PLANS
// =====================================================

export async function createSubscriptionPlan(req, res) {
  try {
    const plan =
      await createSubscriptionPlanService(
        req.validatedData.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Subscription plan created successfully.",
      data: plan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getSubscriptionPlans(req, res) {
  try {
    const result =
      await getSubscriptionPlansService(
        req.validatedData.query
      );

    return res.status(200).json({
      success: true,
      data: result.plans,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getSubscriptionPlanById(req, res) {
  try {
    const plan =
      await getSubscriptionPlanByIdService(
        req.validatedData.params.id
      );

    return res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


export async function updateSubscriptionPlan(req, res) {
  try {
    const plan =
      await updateSubscriptionPlanService(
        req.validatedData.params.id,
        req.validatedData.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Subscription plan updated successfully.",
      data: plan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


export async function deleteSubscriptionPlan(req, res) {
  try {
    await deleteSubscriptionPlanService(
      req.validatedData.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Subscription plan deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// USER SUBSCRIPTIONS
// =====================================================

export async function createUserSubscription(req, res) {
  try {
    const subscription =
      await createUserSubscriptionService(
        req.validatedData.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Subscription created successfully.",
      data: subscription,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getUserSubscriptions(req, res) {
  try {
    const result =
      await getUserSubscriptionsService(
        req.validatedData.query
      );

    return res.status(200).json({
      success: true,
      data: result.subscriptions,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getUserSubscriptionById(req, res) {
  try {
    const subscription =
      await getUserSubscriptionByIdService(
        req.validatedData.params.id
      );

    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getActiveUserSubscription(req, res) {
  try {
    const subscription =
      await getActiveUserSubscriptionService(
        req.validatedData.params.userId
      );

    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


export async function cancelUserSubscription(req, res) {
  try {
    const subscription =
      await cancelUserSubscriptionService(
        req.validatedData.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Subscription cancelled successfully.",
      data: subscription,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


export async function expireUserSubscription(req, res) {
  try {
    const subscription =
      await expireUserSubscriptionService(
        req.validatedData.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Subscription expired successfully.",
      data: subscription,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


export async function deleteUserSubscription(req, res) {
  try {
    await deleteUserSubscriptionService(
      req.validatedData.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Subscription deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}