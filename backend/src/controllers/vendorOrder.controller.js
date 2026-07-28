import {
  getVendorOrdersService,
  getVendorOrderByIdService,
  updateVendorOrderStatusService,
} from "../services/vendorOrder.service.js";

export async function getVendorOrders(req, res) {
  try {
    const orders = await getVendorOrdersService(req.user.id);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getVendorOrderById(req, res) {
  try {
    const order = await getVendorOrderByIdService(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateVendorOrderStatus(req, res) {
  try {
    const order = await updateVendorOrderStatusService(
      req.user.id,
      req.params.id,
      req.validatedData.status
    );

    return res.status(200).json({
      success: true,
      message: "Vendor order updated successfully.",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}