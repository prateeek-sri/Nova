import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 4,
  message: "Too many requests from this IP, please try again after a minute.",
});
