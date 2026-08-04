import { createPurchaseService, updatePurchaseItemService, updatePurchaseService, deletePurchaseService, submitPurchaseService, addPurchaseItemService, removePurchaseItemService } from "../services/purchase.service"

export async function createPurchase(req, res) {
  try {
    const purchase = await createPurchaseService(
      req.user,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Purchase created successfully.",
      data: purchase,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updatePurchase(req, res) {
  try {
    const purchase = await updatePurchaseService(
      req.user,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Purchase updated successfully.",
      data: purchase,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deletePurchase(req, res) {
  try {
    const result = await deletePurchaseService(
      req.user,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function addPurchaseItem(req, res) {
  try {
    const item = await addPurchaseItemService(
      req.user,
      req.params.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Purchase item added successfully.",
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updatePurchaseItem(req, res) {
  try {
    const item = await updatePurchaseItemService(
      req.user,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Purchase item updated successfully.",
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function removePurchaseItem(req, res) {
  try {
    await removePurchaseItemService(
      req.user,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Purchase item removed successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function submitPurchase(req, res) {
  try {
    const purchase = await submitPurchaseService(
      req.user,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Purchase submitted successfully.",
      data: purchase,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}