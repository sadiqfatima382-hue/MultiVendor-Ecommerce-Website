import prisma from "../config/prisma.js";

export async function createAddress(data) {
  return prisma.address.create({
    data,
  });
}

export async function findAddressesByUserId(userId) {
  return prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        isDefault: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });
}

export async function findAddressById(id) {
  return prisma.address.findUnique({
    where: {
      id,
    },
  });
}

export async function findAddressByIdAndUser(id, userId) {
  return prisma.address.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function updateAddress(id, data) {
  return prisma.address.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteAddress(id) {
  return prisma.address.delete({
    where: {
      id,
    },
  });
}

export async function findDefaultAddress(userId) {
  return prisma.address.findFirst({
    where: {
      userId,
      isDefault: true,
    },
  });
}

export async function clearDefaultAddress(userId) {
  return prisma.address.updateMany({
    where: {
      userId,
      isDefault: true,
    },
    data: {
      isDefault: false,
    },
  });
}

export async function setDefaultAddress(id) {
  return prisma.address.update({
    where: {
      id,
    },
    data: {
      isDefault: true,
    },
  });
}

export async function findFirstUserAddress(userId) {
  return prisma.address.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function countUserAddresses(userId) {
  return prisma.address.count({
    where: {
      userId,
    },
  });
}