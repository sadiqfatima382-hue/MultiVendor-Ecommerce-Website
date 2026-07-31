import { getCustomerDashboardService } from "../services/customerDashboard.service.js";

export async function getCustomerDashboard(req, res, next) {
  try {
    const data = await getCustomerDashboardService(req.user.id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}