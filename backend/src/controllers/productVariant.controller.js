import { createProductVariantService, getProductVariantsService, getProductVariantByIdService, updateProductVariantService, deleteProductVariantService, } from "../services/productVariant.service.js";

export async function createProductVariant(req, res, next) {
  try {
    const variant = await createProductVariantService(req.validatedData);

    return res.status(201).json({
      success: true,
      message: "Product Variant created successfully.",
      data: variant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getProductVariants(req, res, next) {
  try {
    const variants = await getProductVariantsService(req.query);

    return res.status(200).json({
      success: true,
      message: "Product Variants fetched successfully.",
      data: variants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getProductVariantById(req, res, next) {
  try {
    const variant = await getProductVariantByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product Variant fetched successfully.",
      data: variant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,

    });
  }
}

export async function updateProductVariant(req, res, next) {
  try {
    const variant = await updateProductVariantService(
      req.params.id,
      req.validatedData
    );

    return res.status(200).json({
      success: true,
      message: "Product Variant updated successfully.",
      data: variant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,

    });
  }
}

export async function deleteProductVariant(req, res, next) {
  try {
    await deleteProductVariantService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product Variant deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}