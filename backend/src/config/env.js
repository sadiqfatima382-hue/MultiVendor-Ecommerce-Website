import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT,

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
};

export default env;