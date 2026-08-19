import crypto from "crypto";
import {  createOtp,  deleteUserOtps,  findValidOtp,  markOtpAsUsed,} from "../repositories/otp.repository.js";
import { findUserById } from "../repositories/auth.repository.js";
import { queueEmail } from "../queues/email.job.js";

export async function generateEmailVerificationOtpService(
  userId
) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  await deleteUserOtps(
    userId,
    "EMAIL_VERIFICATION"
  );

  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await createOtp({
    code: otp,
    type: "EMAIL_VERIFICATION",
    userId,
    expiresAt,
  });

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

export async function verifyOtpService(
  userId,
  code,
  type
) {
  const otp = await findValidOtp(
    userId,
    code,
    type
  );

  if (!otp) {
    throw new Error(
      "Invalid or expired OTP."
    );
  }

  await markOtpAsUsed(otp.id);

  return {
    message: "OTP verified successfully.",
  };
}