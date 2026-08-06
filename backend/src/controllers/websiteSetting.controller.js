import {
  createWebsiteSettingService,
  getWebsiteSettingService,
  updateWebsiteSettingService,
} from "../services/websiteSetting.service.js";

export async function createWebsiteSetting(
  req,
  res
) {
  try {
    const setting =
      await createWebsiteSettingService(
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Website setting created successfully.",
      data: setting,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
}

export async function getWebsiteSetting(
  req,
  res
) {
  try {
    const setting =
      await getWebsiteSettingService();

    res.json({
      success: true,
      data: setting,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
}

export async function updateWebsiteSetting(
  req,
  res
) {
  try {
    const setting =
      await updateWebsiteSettingService(
        req.body
      );

    res.json({
      success: true,
      message:
        "Website setting updated successfully.",
      data: setting,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
}