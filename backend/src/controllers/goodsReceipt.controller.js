import { receivePurchaseService } from "../services/goodsReceipt.service.js";

export async function receivePurchase(req, res) {
  try {
    const receipt = await receivePurchaseService(
      req.user,
      req.params.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Goods received successfully.",
      data: receipt,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}