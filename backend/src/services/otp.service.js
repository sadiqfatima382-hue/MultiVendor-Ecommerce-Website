import crypto from "crypto";
import {  createOtp,  deleteUserOtps,  findValidOtp,  markOtpAsUsed,} from "../repositories/otp.repository.js";
import { findUserById } from "../repositories/user.repository.js";
import { queueEmail } from "../queues/email.jobs.js";

export async function generateOtpService(
  userId,
  type
) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Remove previous OTPs of the same type
  await deleteUserOtps(userId, type);

  // Generate 6-digit OTP
  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  // OTP expires in 10 minutes
  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await createOtp({
    code: otp,
    type,
    userId,
    expiresAt,
  });

  // Queue OTP email
  await queueEmail({
    type: "OTP",
    to: user.email,
    name: user.name,
    otp,
  });

  return {
    message: "OTP sent successfully.",
  };
}