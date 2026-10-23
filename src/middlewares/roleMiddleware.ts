import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { UserRole } from "../entities/User";
import { logger } from "../config/logger";

export function roleMiddleware(...roles: UserRole[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!roles.some((role) => role === req.user.role)) {
      logger.warn(
        `Acesso negado | Usuário ID: ${req.user.sub} | Role: ${req.user.role} | Rota: ${req.path}`,
      );
      throw new AppError("Acesso negado", 403);
    }
    next();
  };
}
