import {  createOrderService,  getOrdersService,  getOrderByIdService, updateOrderStatusService } from "../services/order.service.js";

export async function createOrder(req, res) {
  try {
    const result = await createOrderService(
      req.user.id,
      req.validatedData.paymentMethod,
      req.validatedData.addressId
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await getOrdersService(req.user.id);

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

export async function getOrderById(req, res) {
  try {
    const order = await getOrderByIdService(
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

export async function updateOrderStatus(
  req,
  res
) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required.",
      });
    }

    const order =
      await updateOrderStatusService(
        orderId,
        status
      );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: order,
    });

  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}