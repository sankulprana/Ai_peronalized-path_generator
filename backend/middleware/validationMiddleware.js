/**
 * Input validation middlewares for Authentication endpoints
 */

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

/**
 * Validate User Registration payload
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required");
  } else if (name.trim().length > 50) {
    errors.push("Name cannot exceed 50 characters");
  }

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(", ")));
  }

  next();
};

/**
 * Validate User Login payload
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (!password || password.trim().length === 0) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(", ")));
  }

  next();
};

/**
 * Validate Profile Update payload
 */
export const validateProfileUpdate = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (email && !EMAIL_REGEX.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (password && password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(", ")));
  }

  next();
};
