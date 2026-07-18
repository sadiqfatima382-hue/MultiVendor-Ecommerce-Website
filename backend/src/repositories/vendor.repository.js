import prisma from "../config/prisma.js";

export async function findVendorById(id) {
  return prisma.vendor.findUnique({
    where: { id },
  });
}

export async function findVendorByBusinessName(businessName) {
  return prisma.vendor.findFirst({
    where: {
      businessName: {
        equals: businessName,
        mode: "insensitive",
      },
    },
  });
}

export async function findVendorBySlug(slug) {
  return prisma.vendor.findUnique({
    where: { slug },
  });
}

export async function findVendorByOwnerId(ownerId) {
  return prisma.vendor.findUnique({
    where: { ownerId },
  });
}

export async function createVendor(data) {
  return prisma.vendor.create({
    data,
  });
}

export async function findVendors({
  skip,
  take,
  where,
  orderBy,
}) {
  return prisma.vendor.findMany({
    skip,
    take,
    where,
    orderBy,

    select: {
      id: true,
      businessName: true,
      slug: true,
      description: true,

      logo: true,

      phone: true,
      email: true,

      address: true,
      city: true,
      country: true,

      status: true,

      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function countVendors(where) {
  return prisma.vendor.count({
    where,
  });
}

export async function updateVendor(id, data) {
  return prisma.vendor.update({
    where: { id },
    data,
  });
}

export async function deleteVendor(id) {
  return prisma.vendor.delete({
    where: { id },
  });
}