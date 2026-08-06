import {
  createWebsiteIconService,
  getWebsiteIconsService,
  getWebsiteIconByTypeService,
  updateWebsiteIconService,
  deleteWebsiteIconService,
} from "../services/websiteIcon.service.js";

export async function createWebsiteIcon(
  req,
  res
) {
  try {
    const icon =
      await createWebsiteIconService(
        req.body,
        req.file
      );

    res.status(201).json({
      success: true,
      message:
        "Website icon created successfully.",
      data: icon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getWebsiteIcons(
  req,
  res
) {
  try {
    const icons =
      await getWebsiteIconsService();

    res.json({
      success: true,
      data: icons,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getWebsiteIconByType(
  req,
  res
) {
  try {
    const icon =
      await getWebsiteIconByTypeService(
        req.params.type
      );

    res.json({
      success: true,
      data: icon,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateWebsiteIcon(
  req,
  res
) {
  try {
    const icon =
      await updateWebsiteIconService(
        req.params.type,
        req.body,
        req.file
      );

    res.json({
      success: true,
      message:
        "Website icon updated successfully.",
      data: icon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteWebsiteIcon(
  req,
  res
) {
  try {
    await deleteWebsiteIconService(
      req.params.type
    );

    res.json({
      success: true,
      message:
        "Website icon deleted successfully.",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}