import { createVendorService, getVendorsService, getVendorByIdService, updateVendorService, deleteVendorService, } from "../services/vendor.service.js";

export async function createVendor(req, res, next) {
  try {
    const vendor = await createVendorService(req.validatedData);

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully.",
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
  
    });
  }
}

export async function getVendors(req, res, next) {
  try {
    const vendors = await getVendorsService(req.query);

    return res.status(200).json({
      success: true,
      message: "Vendors fetched successfully.",
      data: vendors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      
    });
  }
}

export async function getVendorById(req, res, next) {
  try {
    const vendor = await getVendorByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Vendor fetched successfully.",
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      
    });
  }
}

export async function updateVendor(req, res, next) {
  try {
    const vendor = await updateVendorService(
      req.params.id,
      req.validatedData
    );

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully.",
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      
    });
  }
}

export async function deleteVendor(req, res, next) {
  try {
    await deleteVendorService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}