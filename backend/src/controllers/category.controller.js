import { success } from "zod";
import { createCategoryService,getCategoryByIdService,updateCategoryService,deleteCategoryService } from "../services/category.service.js";

export async function createCategory(req, res, next) {
  try {
    const category = await createCategoryService(req.validatedData);

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: category,
    });
  }
}

export async function getCategoryById(req, res, next) {
  try {
    const category = await getCategoryByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: category,
    });
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await updateCategoryService(
      req.params.id,
      req.validatedData
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: category,
    });
  }
}

export async function deleteCategory(req, res, next) {
  try {
    await deleteCategoryService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}