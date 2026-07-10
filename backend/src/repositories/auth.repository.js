import prisma from "../config/prisma.js";

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  });
}

export async function findRoleByName(name) {
  return prisma.role.findUnique({
    where: { name },
  });
}

export async function createUser(data) {
  return prisma.user.create({
    data,
    include: {
      role: true,
    },
  });
}
  export async function findUserById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      role: true,
    },
  });
}
export async function createRefreshToken(data) {
  return prisma.refreshToken.create({
    data,
  });
}

export async function findRefreshToken(token) {
  return prisma.refreshToken.findUnique({
    where: {
      token,
    },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });
}

export async function deleteRefreshToken(token) {
  return prisma.refreshToken.deleteMany({
    where: {
      token,
    },
  });
}

export async function deleteUserRefreshTokens(userId) {
  return prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
}