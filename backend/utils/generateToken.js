import jwt from "jsonwebtoken";

/**
 * Generate JSON Web Token for authenticated user
 * @param {string} id - User ID
 * @returns {string} Signed JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

export default generateToken;
