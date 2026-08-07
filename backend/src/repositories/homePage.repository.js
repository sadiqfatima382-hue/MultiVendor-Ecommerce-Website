import prisma from "../config/prisma.js";

export async function createHomePage(data, db = prisma) {
  return db.homePage.create({
    data,
  });
}

export async function findHomePageById(id, db = prisma) {
  return db.homePage.findUnique({
    where: {
      id,
    },
  });
}

export async function findHomePageBySlug(slug, db = prisma) {
  return db.homePage.findUnique({
    where: {
      slug,
    },
  });
}

export async function findHomePageByName(name, db = prisma) {
  return db.homePage.findFirst({
    where: {
      name,
    },
  });
}

export async function findHomePages({
  skip,
  take,
  where,
  orderBy,
  db = prisma,
}) {
  return db.homePage.findMany({
    skip,
    take,
    where,
    orderBy,
    include: {
      components: {
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          componentType: true,
        },
      },
    },
  });
}

export async function countHomePages(where, db = prisma) {
  return db.homePage.count({
    where,
  });
}

export async function updateHomePage(id, data, db = prisma) {
  return db.homePage.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteHomePage(id, db = prisma) {
  return db.homePage.delete({
    where: {
      id,
    },
  });
}