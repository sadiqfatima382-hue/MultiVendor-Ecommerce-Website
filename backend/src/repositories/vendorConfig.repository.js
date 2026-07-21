import prisma from "../config/prisma.js";

// Create Config
export async function createVendorConfig(data) {
  return prisma.vendorConfig.create({
    data,
  });
}

// Get Config by Vendor
export async function findVendorConfigByVendorId(vendorId) {
  return prisma.vendorConfig.findUnique({
    where: {
      vendorId,
    },
    select: {
      id: true,
      logo: true,
      banner: true,
      storeDescription: true,

      businessEmail: true,
      businessPhone: true,

      facebook: true,
      instagram: true,
      twitter: true,
      linkedin: true,
      youtube: true,

      returnPolicy: true,
      shippingPolicy: true,
      privacyPolicy: true,
      termsConditions: true,

      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,

      vendorId: true,

      createdAt: true,
      updatedAt: true,
    },
  });
}

// Update Config
export async function updateVendorConfig(vendorId, data) {
  return prisma.vendorConfig.update({
    where: {
      vendorId,
    },
    data,
    select: {
      id: true,
      logo: true,
      banner: true,
      storeDescription: true,

      businessEmail: true,
      businessPhone: true,

      facebook: true,
      instagram: true,
      twitter: true,
      linkedin: true,
      youtube: true,

      returnPolicy: true,
      shippingPolicy: true,
      privacyPolicy: true,
      termsConditions: true,

      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,

      vendorId: true,

      createdAt: true,
      updatedAt: true,
    },
  });
}

// Delete Config (optional)
export async function deleteVendorConfig(vendorId) {
  return prisma.vendorConfig.delete({
    where: {
      vendorId,
    },
  });
}

// Find Vendor
export async function findVendorById(id) {
  return prisma.vendor.findUnique({
    where: {
      id,
    },
  });
}