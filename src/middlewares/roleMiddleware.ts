import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { UserRole } from "../entities/User";

export function roleMiddleware(...roles: UserRole[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!roles.some((role) => role === req.user.role)) {
      throw new AppError("Acesso negado", 403);
    }
    next();
  };
}
