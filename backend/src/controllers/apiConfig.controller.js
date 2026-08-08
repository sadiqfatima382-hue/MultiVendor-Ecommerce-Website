import {
  createApiConfigService,
  getApiConfigsService,
  getApiConfigByIdService,
  getApiConfigByNameService,
  updateApiConfigService,
  deleteApiConfigService,
} from "../services/apiConfig.service.js";

function sanitizeApiConfig(config) {
  return {
    id: config.id,
    name: config.name,
    baseUrl: config.baseUrl,
    isActive: config.isActive,
    description: config.description,
    createdAt: config.createdAt,
    updatedAt: config.updatedAt,
  };
}


// =====================================================
// CREATE
// =====================================================

export async function createApiConfig(req, res) {
  try {
    const config =
      await createApiConfigService(
        req.validatedData.body
      );

    return res.status(201).json({
      success: true,
      message:
        "API configuration created successfully.",
      data: sanitizeApiConfig(config),
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

export async function getApiConfigs(req, res) {
  try {
    const result =
      await getApiConfigsService({
        page: req.validatedData.query.page,
        limit: req.validatedData.query.limit,
        search: req.validatedData.query.search,
        isActive:
          req.validatedData.query.isActive,
      });

    return res.status(200).json({
      success: true,
      data: result.apiConfigs.map(
        sanitizeApiConfig
      ),
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
// GET BY ID
// =====================================================

export async function getApiConfigById(req, res) {
  try {
    const config =
      await getApiConfigByIdService(
        req.validatedData.params.id
      );

    return res.status(200).json({
      success: true,
      data: sanitizeApiConfig(config),
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// GET BY NAME
// =====================================================

export async function getApiConfigByName(req, res) {
  try {
    const config =
      await getApiConfigByNameService(
        req.validatedData.params.name
      );

    return res.status(200).json({
      success: true,
      data: sanitizeApiConfig(config),
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

export async function updateApiConfig(req, res) {
  try {
    const config =
      await updateApiConfigService(
        req.validatedData.params.id,
        req.validatedData.body
      );

    return res.status(200).json({
      success: true,
      message:
        "API configuration updated successfully.",
      data: sanitizeApiConfig(config),
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

export async function deleteApiConfig(req, res) {
  try {
    await deleteApiConfigService(
      req.validatedData.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "API configuration deleted successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}