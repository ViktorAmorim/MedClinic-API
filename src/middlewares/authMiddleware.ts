import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { verificarToken } from "../utils/jwt";

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
    throw new AppError("Token nao informado", 401);
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    throw new AppError("Token nao informado", 401);
  }

  try {
    const tokenPayload = verificarToken(token);
    req.user = tokenPayload;
    next();
  } catch (error) {
    throw new AppError("Token invalido", 401);
  }
}
