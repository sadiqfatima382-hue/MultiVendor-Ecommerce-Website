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
export async function updateUserRole(userId, roleId) {
  return prisma.user.update({
    where: { id: userId },
    data: { roleId },
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


export async function findUserWithRole(userId) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      role: true,
    },
  });
}

export async function createPasswordResetToken(data) {
  return prisma.passwordResetToken.create({
    data,
  });
}

export async function findPasswordResetToken(token) {
  return prisma.passwordResetToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });
}

export async function deletePasswordResetToken(token) {
  return prisma.passwordResetToken.delete({
    where: {
      token,
    },
  });
}

export async function deleteUserPasswordResetTokens(userId) {
  return prisma.passwordResetToken.deleteMany({
    where: {
      userId,
    },
  });
}