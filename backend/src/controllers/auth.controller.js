import { success } from "zod";
import { registerUser, loginUser, refreshUserToken, logoutUser } from "../services/auth.service.js";
// import { loginUser } from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const result = await registerUser(req.validatedData);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: result,
    });
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: error.message,
      
    });
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.validatedData);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: error.message,
     
    });
  }
}

export async function getMe(req,res) {
  return res.status(200).json({
    success: true,
    message: "User Fetched Successfully",
    data: req.user,
  })
}
export async function refreshToken(req, res, next) {
  try {
    const result = await refreshUserToken(req.validatedData);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      
    });
  }
}
export async function logout(req, res, next) {
  try {
    const result = await logoutUser(req.validatedData);

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