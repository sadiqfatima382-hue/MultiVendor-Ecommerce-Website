import { createSupplier, findSupplierById, findSupplierByEmail,findSupplierByPhone,updateSupplier,deleteSupplier, countSuppliers, findSuppliers } from "../repositories/supplier.repository";
import { findVendorByOwnerId } from "../repositories/vendor.repository";
import { getPagination } from "../utils/pagination";

export async function createSupplierService(user, body) {

  if (body.email) {
    const emailExists = await findSupplierByEmail(body.email);

    if (emailExists) {
      throw new Error("Supplier email already exists.");
    }
  }

  if (body.phone) {
    const phoneExists = await findSupplierByPhone(body.phone);

    if (phoneExists) {
      throw new Error("Supplier phone already exists.");
    }
  }

  const data = {
    ...body,
    createdById: user.id,
  };

  // Vendor creates supplier
  if (user.role.name === "VENDOR") {

    const vendor = await findVendorByOwnerId(user.id);

    if (!vendor) {
      throw new Error("Vendor not found.");
    }

    data.vendorId = vendor.id;
  }

  // Super Admin creates global supplier
  if (user.role.name === "SUPER_ADMIN") {
    data.vendorId = null;
  }

  return createSupplier(data);
}

export async function getSuppliersService(user, query) {

  const {
    search,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const { page, limit, skip, take } =
    getPagination(query);

  const where = {};

  if (search?.trim()) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        company: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (user.role.name === "VENDOR") {

    const vendor =
      await findVendorByOwnerId(user.id);

    where.vendorId = vendor.id;
  }

  const allowedSortFields = [
    "name",
    "company",
    "createdAt",
  ];

  const orderBy = {
    [
      allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt"
    ]: sortOrder === "asc"
      ? "asc"
      : "desc",
  };

  const [suppliers, total] =
    await Promise.all([

      findSuppliers({
        where,
        skip,
        take,
        orderBy,
      }),

      countSuppliers(where),

    ]);

  return {

    suppliers,

    pagination: {

      page,
      limit,
      total,

      totalPages: Math.ceil(total / limit),

      hasNextPage:
        page < Math.ceil(total / limit),

      hasPreviousPage:
        page > 1,

    },

  };

}

export async function getSupplierByIdService(user, id) {

  const supplier =
    await findSupplierById(id);

  if (!supplier) {
    throw new Error("Supplier not found.");
  }

  if (
    user.role.name === "VENDOR" &&
    supplier.vendorId !==
      (await findVendorByOwnerId(user.id)).id
  ) {
    throw new Error(
      "You are not allowed to access this supplier."
    );
  }

  return supplier;
}

export async function updateSupplierService(
  user,
  id,
  body
) {

  const supplier =
    await findSupplierById(id);

  if (!supplier) {
    throw new Error("Supplier not found.");
  }

  if (body.email) {
    const emailExists =
      await findSupplierByEmail(body.email);

    if (
      emailExists &&
      emailExists.id !== supplier.id
    ) {
      throw new Error(
        "Supplier email already exists."
      );
    }
  }

  if (body.phone) {
    const phoneExists =
      await findSupplierByPhone(body.phone);

    if (
      phoneExists &&
      phoneExists.id !== supplier.id
    ) {
      throw new Error(
        "Supplier phone already exists."
      );
    }
  }

  if (user.role.name === "VENDOR") {

    const vendor =
      await findVendorByOwnerId(user.id);

    if (supplier.vendorId !== vendor.id) {
      throw new Error(
        "You are not allowed to update this supplier."
      );
    }

  }

  return updateSupplier(id, body);
}

export async function deleteSupplierService(
  user,
  id
) {

  const supplier =
    await findSupplierById(id);

  if (!supplier) {
    throw new Error("Supplier not found.");
  }

  if (user.role.name === "VENDOR") {

    const vendor =
      await findVendorByOwnerId(user.id);

    if (supplier.vendorId !== vendor.id) {
      throw new Error(
        "You are not allowed to delete this supplier."
      );
    }

  }

  return deleteSupplier(id);
}