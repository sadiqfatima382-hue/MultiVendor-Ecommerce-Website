import {
  createCustomerReturnService,
  getCustomerReturnByIdService,
  getCustomerReturnsService,
  approveCustomerReturnService,
  rejectCustomerReturnService,
  receiveCustomerReturnService,
  refundCustomerReturnService,
  deleteCustomerReturnService,
} from "../services/customerReturn.service.js";

// =====================================================
// CREATE RETURN
// =====================================================

export async function createCustomerReturn(req, res) {
  try {
    const result =
      await createCustomerReturnService(
        req.user.id,
        req.validatedData.body
      );

    return res.status(201).json({
      success: true,
      message: "Return request created successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// GET MY RETURNS
// =====================================================

export async function getMyCustomerReturns(req, res) {
  try {
    const result =
      await getCustomerReturnsService({
        userId: req.user.id,
        isAdmin: false,
        ...req.validatedData.query,
      });

    return res.status(200).json({
      success: true,
      data: result.returns,
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
// GET ALL RETURNS - ADMIN
// =====================================================

export async function getCustomerReturns(req, res) {
  try {
    const result =
      await getCustomerReturnsService({
        isAdmin: true,
        ...req.validatedData.query,
      });

    return res.status(200).json({
      success: true,
      data: result.returns,
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
// GET RETURN BY ID
// =====================================================

export async function getCustomerReturnById(req, res) {
  try {
    const customerReturn =
      await getCustomerReturnByIdService(
        req.validatedData.params.id,
        req.user.id,
        false
      );

    return res.status(200).json({
      success: true,
      data: customerReturn,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// GET RETURN BY ID - ADMIN
// =====================================================

export async function getCustomerReturnByIdAdmin(req, res) {
  try {
    const customerReturn =
      await getCustomerReturnByIdService(
        req.validatedData.params.id,
        req.user.id,
        true
      );

    return res.status(200).json({
      success: true,
      data: customerReturn,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// APPROVE
// =====================================================

export async function approveCustomerReturn(req, res) {
  try {
    const result =
      await approveCustomerReturnService(
        req.validatedData.params.id,
        req.validatedData.body.adminNotes
      );

    return res.status(200).json({
      success: true,
      message: "Return approved successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// REJECT
// =====================================================

export async function rejectCustomerReturn(req, res) {
  try {
    const result =
      await rejectCustomerReturnService(
        req.validatedData.params.id,
        req.validatedData.body.adminNotes
      );

    return res.status(200).json({
      success: true,
      message: "Return rejected successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// RECEIVE
// =====================================================

export async function receiveCustomerReturn(req, res) {
  try {
    const result =
      await receiveCustomerReturnService(
        req.validatedData.params.id,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message: "Return received and inventory updated successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// REFUND
// =====================================================

export async function refundCustomerReturn(req, res) {
  try {
    const result =
      await refundCustomerReturnService(
        req.validatedData.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Return marked as refunded successfully.",
      data: result,
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

export async function deleteCustomerReturn(req, res) {
  try {
    await deleteCustomerReturnService(
      req.validatedData.params.id,
      req.user.id,
      false
    );

    return res.status(200).json({
      success: true,
      message: "Return request deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}