import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

export const createRateLimiter = () => {
  const rateLimiter = new RateLimiterMemory({
    keyPrefix: "middleware",
    points: 100, // 10 requests
    duration: 600, // per 100 second by IP
  });
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await rateLimiter.consume(req.ip);
      next();
    } catch {
      res.status(429).send("Too Many Requests");
    }
  };
};
