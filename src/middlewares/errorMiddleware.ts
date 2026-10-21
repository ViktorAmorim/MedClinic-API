import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      message: "JSON inválido. Verifique a sintaxe dos dados enviados.",
    });
  }

  return res.status(500).json({ message: "Erro interno no servidor" });
}
