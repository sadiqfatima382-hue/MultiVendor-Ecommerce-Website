import { hashPassword, comparePassword } from "../utils/password.js";
import { findUserByEmail, findRoleByName,createUser,} from "../repositories/auth.repository.js";
import { verifyAccessToken, generateAccessToken,generateRefreshToken, verifyRefreshToken} from "../utils/jwt.js";
import { findRefreshToken, createRefreshToken, deleteRefreshToken } from "../repositories/auth.repository.js";
import { ROLES } from "../constants/auth/roles.js";

// Registration
export async function registerUser(data) {
  try {
    const { name, email, password } = data;

    // Check existing user
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new Error("Email already exists.");
    }

    // Get Customer role
    const customerRole = await findRoleByName(ROLES.CUSTOMER);

    if (!customerRole) {
      throw new Error("Customer role not found.");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      roleId: customerRole.id,
    });

    // Generate Tokens
    const payload = {
      userId: user.id,
      roleId: user.roleId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in database
    await createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Remove password before sending response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("❌ registerUser Error:", error);
    throw error;
  }
}

// Login
export async function loginUser(data) {
  try {
    const { email, password } = data;

    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    const payload = {
      userId: user.id,
      roleId: user.roleId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("❌ loginUser Error:", error);
    throw error;
  }
}

export async function refreshUserToken(data) {
  try {
    const { refreshToken } = data;

    console.log("🔄 Attempting token refresh with token:", refreshToken.substring(0, 20) + "...");

    // Verify JWT
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
      console.log("✅ JWT verification successful for userId:", decoded.userId);
    } catch (jwtError) {
      console.error("❌ JWT verification failed:", jwtError.message);
      throw new Error("Invalid or expired refresh token.");
    }

    // Check token exists in database
    const storedToken = await findRefreshToken(refreshToken);
    console.log("🔍 Token lookup result:", storedToken ? "Found" : "Not found");

    if (!storedToken) {
      throw new Error("Refresh token not found in database. Please login again.");
    }

    // Check token expiration
    if (new Date() > new Date(storedToken.expiresAt)) {
      await deleteRefreshToken(refreshToken);
      throw new Error("Refresh token has expired. Please login again.");
    }

    // Delete old refresh token (rotation)
    await deleteRefreshToken(refreshToken);

    const payload = {
      userId: decoded.userId,
      roleId: decoded.roleId,
    };

    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await createRefreshToken({
      token: newRefreshToken,
      userId: decoded.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.error("❌ refreshUserToken Error:", error);
    throw error;
  }
}
export async function logoutUser(data) {
  const { refreshToken } = data;

  await deleteRefreshToken(refreshToken);

  return {
    message: "Logged out successfully.",
  };
}