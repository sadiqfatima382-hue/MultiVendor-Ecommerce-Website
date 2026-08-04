import {  approvePurchaseService,} from "../services/purchase.service.js";
export async function approvePurchase(req, res) {
  try {
    const purchase = await approvePurchaseService(
      req.user,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Purchase approved successfully.",
      data: purchase,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}