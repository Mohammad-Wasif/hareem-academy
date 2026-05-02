import type { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Check session first (for local dev)
  if (req.session?.isAdmin) {
    return next();
  }

  // Fallback to header (for production cross-domain)
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (req.headers["x-admin-password"] === adminPassword) {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized" });
}
