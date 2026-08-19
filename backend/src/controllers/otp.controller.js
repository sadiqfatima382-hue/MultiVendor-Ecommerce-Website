import {  generateEmailVerificationOtpService,} from "../services/otp.service.js";

export async function sendEmailVerificationOtpController(
  req,
  res
) {
  try {
    const userId = req.user.id;

    const result =
      await generateEmailVerificationOtpService(
        userId
      );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}