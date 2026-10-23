import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { verificarToken } from "../utils/jwt";
import { logger } from "../config/logger";

declare global {
  namespace Express {
    interface Request {
      user: {
        sub: string;
        role: string;
      };
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn(
      `Autenticação negada | Token não informado | Rota: ${req.originalUrl.split("?")[0]}`,
    );
    throw new AppError("Token nao informado", 401);
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    logger.warn(
      `Autenticação negada | Token nao informado | Rota: ${req.originalUrl.split("?")[0]}`,
    );
    throw new AppError("Token nao informado", 401);
  }

  try {
    const tokenPayload = verificarToken(token);
    req.user = tokenPayload;
    next();
  } catch (error) {
    logger.warn(
      `Autenticação negada | Token invalido ou expirado | Rota: ${req.originalUrl.split("?")[0]}`,
    );
    throw new AppError("Token invalido", 401);
  }
}
