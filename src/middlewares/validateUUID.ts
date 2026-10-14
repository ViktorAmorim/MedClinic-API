import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function validateUUID(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id as string;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(id)) {
    throw new AppError("ID inválido. Informe um UUID válido.", 400);
  }

  next();
}
