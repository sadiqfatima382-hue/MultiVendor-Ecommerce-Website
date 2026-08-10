import prisma from "../config/prisma.js";


// =====================================================
// CREATE
// =====================================================

export async function createBlogPost(
  data,
  db = prisma
) {
  return db.blogPost.create({
    data,
  });
}


// =====================================================
// FIND BY ID
// =====================================================

export async function findBlogPostById(
  id,
  db = prisma
) {
  return db.blogPost.findUnique({
    where: {
      id,
    },
  });
}


// =====================================================
// FIND BY SLUG
// =====================================================

export async function findBlogPostBySlug(
  slug,
  db = prisma
) {
  return db.blogPost.findUnique({
    where: {
      slug,
    },
  });
}


// =====================================================
// FIND ALL
// =====================================================

export async function findBlogPosts(
  {
    skip,
    take,
    where,
    orderBy,
  },
  db = prisma
) {
  return db.blogPost.findMany({
    skip,
    take,
    where,
    orderBy,

    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}


// =====================================================
// COUNT
// =====================================================

export async function countBlogPosts(
  where,
  db = prisma
) {
  return db.blogPost.count({
    where,
  });
}


// =====================================================
// UPDATE
// =====================================================

export async function updateBlogPost(
  id,
  data,
  db = prisma
) {
  return db.blogPost.update({
    where: {
      id,
    },
    data,
  });
}


// =====================================================
// DELETE
// =====================================================

export async function deleteBlogPost(
  id,
  db = prisma
) {
  return db.blogPost.delete({
    where: {
      id,
    },
  });
}