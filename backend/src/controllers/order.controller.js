import {  createOrderService,  getOrdersService,  getOrderByIdService,} from "../services/order.service.js";

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