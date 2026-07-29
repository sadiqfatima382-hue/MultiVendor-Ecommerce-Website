import { getAdminDashboardService } from "../services/adminDashboard.service.js";

export async function getAdminDashboard(req, res, next) {
  try {
    const dashboard = await getAdminDashboardService();

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      message:error.message
  });
}
}