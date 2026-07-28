import {
  createQualityControlService,
  getQualityControlService,
  updateQualityControlService,
} from "../services/qualityControl.service.js";

export async function createQualityControl(req, res) {
  try {
    const result = await createQualityControlService(
      req.user.id,
      req.params.vendorOrderId,
      req.validatedData
    );

    return res.status(201).json({
      success: true,
      message: "Quality control created successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getQualityControl(req, res) {
  try {
    const result = await getQualityControlService(
      req.user.id,
      req.params.vendorOrderId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateQualityControl(req, res) {
  try {
    const result = await updateQualityControlService(
      req.user.id,
      req.params.vendorOrderId,
      req.validatedData
    );

    return res.status(200).json({
      success: true,
      message: "Quality control updated successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}