const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, no token");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.userId = decoded.id;
    next();
  } catch (_error) {
    throw new ApiError(401, "Not authorized");
  }
});

module.exports = { protect };
