import {  createInventoryAdjustmentService,} from "../services/inventoryAdjustment.service.js";

export async function createInventoryAdjustment(req, res) {
  try {
    const adjustment =
      await createInventoryAdjustmentService(
        req.user,
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Inventory adjustment created successfully.",
      data: adjustment,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
}