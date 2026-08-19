import prisma from "../config/prisma.js";

export async function createOtp(data) {
  return prisma.otp.create({
    data,
  });
}

export async function findValidOtp(userId, code, type) {
  return prisma.otp.findFirst({
    where: {
      userId,
      code,
      type,
      isUsed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function markOtpAsUsed(otpId) {
  return prisma.otp.update({
    where: {
      id: otpId,
    },
    data: {
      isUsed: true,
    },
  });
}

export async function deleteUserOtps(userId, type) {
  return prisma.otp.deleteMany({
    where: {
      userId,
      type,
    },
  });
}