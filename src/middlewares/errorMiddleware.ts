import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { logger } from "../config/logger";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const rota = req.originalUrl.split("?")[0];

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof SyntaxError && "body" in error) {
    logger.warn(`JSON inválido | Método: ${req.method} | Rota: ${rota}`);

    return res.status(400).json({
      message: "JSON inválido. Verifique a sintaxe dos dados enviados.",
    });
  }

  logger.error(`Erro interno | Método: ${req.method} | Rota: ${rota}`);

  return res.status(500).json({ message: "Erro interno no servidor" });
}
