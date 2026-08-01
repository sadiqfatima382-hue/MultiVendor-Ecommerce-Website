import prisma from "../config/prisma.js";

export async function createSupplier(data) {
  return prisma.supplier.create({
    data,
  });
}

export async function findSupplierById(id) {
  return prisma.supplier.findUnique({
    where: {
      id,
    },

    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
        },
      },

      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function findSupplierByEmail(email) {
  return prisma.supplier.findUnique({
    where: {
      email,
    },
  });
}

export async function findSupplierByPhone(phone) {
  return prisma.supplier.findUnique({
    where: {
      phone,
    },
  });
}

export async function findSuppliers({
  where = {},
  skip,
  take,
  orderBy,
}) {
  return prisma.supplier.findMany({
    where,

    skip,
    take,

    orderBy,

    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
        },
      },

      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function countSuppliers(where = {}) {
  return prisma.supplier.count({
    where,
  });
}

export async function updateSupplier(id, data) {
  return prisma.supplier.update({
    where: {
      id,
    },

    data,
  });
}

export async function deleteSupplier(id) {
  return prisma.supplier.update({
    where: {
      id,
    },

    data: {
      status: "INACTIVE",
    },
  });
}