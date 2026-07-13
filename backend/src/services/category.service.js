import { findCategoryByName, findCategoryBySlug, findCategoryById, createCategory, } from "../repositories/category.repository.js";
import { generateSlug } from "../utils/slug.js";
import { getPagination } from "../utils/pagination.js";
import { findCategories, countCategories, updateCategory,deleteCategory, countChildCategories,countProductsByCategory,} from "../repositories/category.repository.js";
import { CATEGORY_SORT_FIELDS } from "../constants/category/sortFields.js";

export async function createCategoryService(data) {
  const { name, description, image, parentId, } = data;

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

//Category pagination
export async function getCategoriesService(query) {
  const {
    search,
    status,
    parentId,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const { page, limit, skip, take } = getPagination(query);

  // Build where clause
  const where = {};

  // Search
  if (search?.trim()) {
    where.OR = [
      {
        name: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
    ];
  }

  // Status filter
  if (status !== undefined) {
    where.status = status === "true";
  }

  // Parent category filter
  if (parentId) {
    where.parentId = parentId;
  }

  const orderBy = {
    [allowedSortFields.includes(sortBy) ? sortBy : "createdAt"]:
      sortOrder === "asc" ? "asc" : "desc",
  };

  // Repository calls
  const [categories, total] = await Promise.all([
    findCategories({
      skip,
      take,
      where,
      orderBy,
    }),
    countCategories(where),
  ]);

  // Pagination
  const totalPages = Math.ceil(total / limit);

  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
//category by id
export async function getCategoryByIdService(id) {
  const category = await findCategoryById(id);

  if (!category) {
    throw new Error("Category not found.");
  }

  return category;
}

//update category
export async function updateCategoryService(id, data) {
  const category = await findCategoryById(id);

  if (!category) {
    throw new Error("Category not found.");
  }

  const name = data.name.trim();
  const normalizedName = name.toLowerCase();

  const slug = generateSlug(name);

  const existingName = await findCategoryByName(normalizedName);

  if (existingName && existingName.id !== id) {
    throw new Error("Category already exists.");
  }

  const existingSlug = await findCategoryBySlug(slug);

  if (existingSlug && existingSlug.id !== id) {
    throw new Error("Slug already exists.");
  }

  if (data.parentId) {
    const parent = await findCategoryById(data.parentId);

    if (!parent) {
      throw new Error("Parent category not found.");
    }

    if (parent.id === id) {
      throw new Error("Category cannot be its own parent.");
    }
  }

  return updateCategory(id, {
    ...data,
    name,
    slug,
  });
}
//delete category
export async function deleteCategoryService(id) {
  const category = await findCategoryById(id);

  if (!category) {
    throw new Error("Category not found.");
  }

  const childCount = await countChildCategories(id);

  if (childCount > 0) {
    throw new Error("Delete child categories first.");
  }

  const productCount = await countProductsByCategory(id);

  if (productCount > 0) {
    throw new Error("Category contains products.");
  }

  await deleteCategory(id);

  return null;
}