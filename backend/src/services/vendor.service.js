import {  findVendorById,  findVendorByBusinessName,  findVendorBySlug,  findVendorByOwnerId,  createVendor,  findVendors,  countVendors,  updateVendor,  deleteVendor,} from "../repositories/vendor.repository.js";
import { findUserById, findRoleByName, updateUserRole } from "../repositories/auth.repository.js";
import { generateSlug } from "../utils/slug.js";
import { getPagination } from "../utils/pagination.js";

export async function createVendorService(data) {
  const {
    businessName,
    description,
    phone,
    email,
    address,
    city,
    country,
    ownerId,
  } = data;

  const normalizedBusinessName = businessName.trim();
  const slug = generateSlug(normalizedBusinessName);

  // Check duplicate business name
  const existingVendor = await findVendorByBusinessName(
    normalizedBusinessName
  );

  if (existingVendor) {
    throw new Error("Vendor already exists.");
  }

  // Check duplicate slug
  const existingSlug = await findVendorBySlug(slug);

  if (existingSlug) {
    throw new Error("Vendor slug already exists.");
  }

  // Verify owner exists
  const owner = await findUserById(ownerId);

  if (!owner) {
    throw new Error("Owner not found.");
  }

  // Verify owner doesn't already own a vendor
  const ownerVendor = await findVendorByOwnerId(ownerId);

  if (ownerVendor) {
    throw new Error("This user already owns a vendor.");
  }

  // ✅ Create vendor
  const vendor = await createVendor({
    businessName: normalizedBusinessName,
    slug,
    description,
    phone,
    email,
    address,
    city,
    country,
    ownerId,
  });

  // ✅ Find VENDOR role
  const vendorRole = await findRoleByName("VENDOR");

  if (!vendorRole) {
    throw new Error("VENDOR role not found.");
  }

  // ✅ Update user's role
  await updateUserRole(ownerId, vendorRole.id);

  return vendor;
}

export async function getVendorsService(query) {
  const {
    search,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const { page, limit, skip, take } = getPagination(query);

  const where = {};

  if (search?.trim()) {
    where.OR = [
      {
        businessName: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
      {
        city: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
    ];
  }

  if (status) {
    where.status = status;
  }

  const allowedSortFields = [
    "businessName",
    "createdAt",
    "updatedAt",
  ];

  const orderBy = {
    [allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt"]: sortOrder === "asc" ? "asc" : "desc",
  };

  const [vendors, total] = await Promise.all([
    findVendors({
      skip,
      take,
      where,
      orderBy,
    }),
    countVendors(where),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    vendors,
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

export async function getVendorByIdService(id) {
  const vendor = await findVendorById(id);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  return vendor;
}

export async function updateVendorService(id, data) {
  const vendor = await findVendorById(id);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  const updateData = { ...data };

  if (data.businessName) {
    const businessName = data.businessName.trim();
    const slug = generateSlug(businessName);

    const existingVendor = await findVendorByBusinessName(businessName);

    if (existingVendor && existingVendor.id !== id) {
      throw new Error("Vendor already exists.");
    }

    const existingSlug = await findVendorBySlug(slug);

    if (existingSlug && existingSlug.id !== id) {
      throw new Error("Vendor slug already exists.");
    }

    updateData.businessName = businessName;
    updateData.slug = slug;
  }

  if (data.ownerId) {
    const owner = await findUserById(data.ownerId);

    if (!owner) {
      throw new Error("Owner not found.");
    }

    const ownerVendor = await findVendorByOwnerId(data.ownerId);

    if (ownerVendor && ownerVendor.id !== id) {
      throw new Error("This user already owns another vendor.");
    }
  }

  return updateVendor(id, updateData);
}

export async function deleteVendorService(id) {
  const vendor = await findVendorById(id);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  await deleteVendor(id);

  return null;
}