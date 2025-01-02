import jwt from "jsonwebtoken";
import CustomError from "../util/CustomError.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
          console.error("JWT verification error:", err.message);
          throw new CustomError("token is not valid", 401);
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      next(new CustomError("you are not authenticated", 401));
    }
  } catch (error) {
    next(new CustomError(error || "failed to verify authentication", 401));
  }
};