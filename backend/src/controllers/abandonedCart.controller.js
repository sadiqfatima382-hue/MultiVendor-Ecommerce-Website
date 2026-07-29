import { getAbandonedCartsService } from "../services/abandonedCart.service.js";

export async function getAbandonedCarts(req, res) {
  try {
    const result = await getAbandonedCartsService(req.query);

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