import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const inicio = Date.now();

  res.on("finish", () => {
    const duracao = Date.now() - inicio;
    logger.http(
      `${req.method} ${req.originalUrl.split("?")[0]} ${res.statusCode} - ${duracao}ms`,
    );
  });

  next();
}
