import bcrypt from "bcrypt";
import env from "../config/env.js";

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(Number(env.BCRYPT_SALT_ROUNDS));

  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}