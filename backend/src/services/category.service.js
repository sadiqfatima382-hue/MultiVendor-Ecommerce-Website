import {findCategoryByName,findCategoryBySlug,findCategoryById,createCategory,} from "../repositories/category.repository.js";
import { generateSlug } from "../utils/slug.js";

export async function createCategoryService(data) {
  const {
    name,
    description,
    image,
    parentId,
  } = data;

  // Normalize category name
  const normalizedName = name.trim().replace(/\s+/g, " ");

  // Generate slug
  const slug = generateSlug(normalizedName);

  // Check duplicate category name
  const existingCategory = await findCategoryByName(normalizedName);

  if (existingCategory) {
    throw new Error("Category already exists.");
  }

  // Check duplicate slug
  const existingSlug = await findCategoryBySlug(slug);

  if (existingSlug) {
    throw new Error("Category slug already exists.");
  }

  // Validate parent category
  if (parentId) {
    const parentCategory = await findCategoryById(parentId);

    if (!parentCategory) {
      throw new Error("Parent category not found.");
    }
  }

  // Create category
  const category = await createCategory({
    name: normalizedName,
    slug,
    description,
    image,
    parentId,
  });

  return category;
}