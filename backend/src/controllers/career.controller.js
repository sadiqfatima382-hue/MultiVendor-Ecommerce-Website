import {
  createCareerService,
  getCareersService,
  getCareerByIdService,
  getCareerBySlugService,
  updateCareerService,
  publishCareerService,
  unpublishCareerService,
  setCareerActiveService,
  deleteCareerService,
} from "../services/career.service.js";

// =====================================================
// CREATE
// =====================================================

export async function createCareer(req, res) {
  try {
    const career = await createCareerService(
      req.validatedData.body
    );

    return res.status(201).json({
      success: true,
      message: "Career created successfully.",
      data: career,
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

export async function getCareers(req, res) {
  try {
    const result = await getCareersService(
      req.validatedData.query
    );

    return res.status(200).json({
      success: true,
      data: result.careers,
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

export async function getCareerById(req, res) {
  try {
    const career = await getCareerByIdService(
      req.validatedData.params.id,
      false
    );

    return res.status(200).json({
      success: true,
      data: career,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// GET BY SLUG - PUBLIC
// =====================================================

export async function getCareerBySlug(req, res) {
  try {
    const career = await getCareerBySlugService(
      req.validatedData.params.slug,
      true
    );

    return res.status(200).json({
      success: true,
      data: career,
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

export async function updateCareer(req, res) {
  try {
    const career = await updateCareerService(
      req.validatedData.params.id,
      req.validatedData.body
    );

    return res.status(200).json({
      success: true,
      message: "Career updated successfully.",
      data: career,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// PUBLISH
// =====================================================

export async function publishCareer(req, res) {
  try {
    const career = await publishCareerService(
      req.validatedData.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Career published successfully.",
      data: career,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// UNPUBLISH
// =====================================================

export async function unpublishCareer(req, res) {
  try {
    const career = await unpublishCareerService(
      req.validatedData.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Career unpublished successfully.",
      data: career,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// OPEN / CLOSE
// =====================================================

export async function setCareerActive(req, res) {
  try {
    const career = await setCareerActiveService(
      req.validatedData.params.id,
      req.validatedData.body.isActive
    );

    return res.status(200).json({
      success: true,
      message: req.validatedData.body.isActive
        ? "Career position opened successfully."
        : "Career position closed successfully.",
      data: career,
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

export async function deleteCareer(req, res) {
  try {
    await deleteCareerService(
      req.validatedData.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Career deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}