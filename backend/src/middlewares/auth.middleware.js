import { verifyAccessToken } from "../utils/jwt.js";
import { findUserById } from "../repositories/auth.repository.js";

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
console.log("Allowed Roles:", roles);
console.log("User Role:", req.user.role?.name);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Access token is missing.",
      });
    }
  
    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    const user = await findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }
req.user = user;

console.log({
  id: req.user.id,
  email: req.user.email,
  role: req.user.role,
  roleName: req.user.role?.name,
});
next();}
catch (error) {
  next();
}}