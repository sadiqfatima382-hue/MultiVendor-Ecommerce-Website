import prisma from "../config/prisma.js";


// =====================================================
// CREATE
// =====================================================

export async function createContactSetting(
  data,
  db = prisma
) {
  return db.contactSetting.create({
    data,
  });
}


// =====================================================
// FIND BY ID
// =====================================================

export async function findContactSettingById(
  id,
  db = prisma
) {
  return db.contactSetting.findUnique({
    where: {
      id,
    },
  });
}


// =====================================================
// FIND ACTIVE
// =====================================================

export async function findActiveContactSetting(
  db = prisma
) {
  return db.contactSetting.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}


// =====================================================
// FIND ALL
// =====================================================

export async function findContactSettings(
  {
    skip,
    take,
    where,
    orderBy,
  },
  db = prisma
) {
  return db.contactSetting.findMany({
    skip,
    take,
    where,
    orderBy,
  });
}


// =====================================================
// COUNT
// =====================================================

export async function countContactSettings(
  where,
  db = prisma
) {
  return db.contactSetting.count({
    where,
  });
}


// =====================================================
// UPDATE
// =====================================================

export async function updateContactSetting(
  id,
  data,
  db = prisma
) {
  return db.contactSetting.update({
    where: {
      id,
    },
    data,
  });
}


// =====================================================
// DELETE
// =====================================================

export async function deleteContactSetting(
  id,
  db = prisma
) {
  return db.contactSetting.delete({
    where: {
      id,
    },
  });
}