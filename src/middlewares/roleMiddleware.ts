import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { UserRole } from "../entities/User";

export function roleMiddleware(role: UserRole) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.user.role !== role) {
      throw new AppError("Acesso negado", 403);
    }
    next();
  };
}
