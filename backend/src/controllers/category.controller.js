import { success } from "zod";
import { createCategoryService, } from "../services/category.service.js";

export async function createCategory(req, res, next) {
  try {
    const category = await createCategoryService(req.validatedData);

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    next(error);
  }
}