import {
  createContactSettingService,
  getContactSettingsService,
  getContactSettingByIdService,
  getActiveContactSettingService,
  updateContactSettingService,
  deleteContactSettingService,
} from "../services/contactSetting.service.js";


// =====================================================
// CREATE
// =====================================================

export async function createContactSetting(req, res) {
  try {
    const setting =
      await createContactSettingService(
        req.validatedData.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Contact setting created successfully.",
      data: setting,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// GET ALL
// =====================================================

export async function getContactSettings(req, res) {
  try {
    const result =
      await getContactSettingsService(
        req.validatedData.query
      );

    return res.status(200).json({
      success: true,
      data: result.settings,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// GET ACTIVE
// =====================================================

export async function getActiveContactSetting(req, res) {
  try {
    const setting =
      await getActiveContactSettingService();

    return res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// GET BY ID
// =====================================================

export async function getContactSettingById(req, res) {
  try {
    const setting =
      await getContactSettingByIdService(
        req.validatedData.params.id
      );

    return res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// UPDATE
// =====================================================

export async function updateContactSetting(req, res) {
  try {
    const setting =
      await updateContactSettingService(
        req.validatedData.params.id,
        req.validatedData.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Contact setting updated successfully.",
      data: setting,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// DELETE
// =====================================================

export async function deleteContactSetting(req, res) {
  try {
    await deleteContactSettingService(
      req.validatedData.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Contact setting deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}