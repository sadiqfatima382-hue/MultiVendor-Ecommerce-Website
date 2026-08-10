import prisma from "../config/prisma.js";


// =====================================================
// CREATE
// =====================================================

export async function createCareer(
  data,
  db = prisma
) {
  return db.career.create({
    data,
  });
}


// =====================================================
// FIND BY ID
// =====================================================

export async function findCareerById(
  id,
  db = prisma
) {
  return db.career.findUnique({
    where: {
      id,
    },
  });
}


// =====================================================
// FIND BY SLUG
// =====================================================

export async function findCareerBySlug(
  slug,
  db = prisma
) {
  return db.career.findUnique({
    where: {
      slug,
    },
  });
}


// =====================================================
// FIND ALL
// =====================================================

export async function findCareers(
  {
    skip,
    take,
    where,
    orderBy,
  },
  db = prisma
) {
  return db.career.findMany({
    skip,
    take,
    where,
    orderBy,
  });
}


// =====================================================
// COUNT
// =====================================================

export async function countCareers(
  where,
  db = prisma
) {
  return db.career.count({
    where,
  });
}


// =====================================================
// UPDATE
// =====================================================

export async function updateCareer(
  id,
  data,
  db = prisma
) {
  return db.career.update({
    where: {
      id,
    },
    data,
  });
}


// =====================================================
// DELETE
// =====================================================

export async function deleteCareer(
  id,
  db = prisma
) {
  return db.career.delete({
    where: {
      id,
    },
  });
}