import jwt from "jsonwebtoken";
import { UserRole } from "../entities/User";
import { AppError } from "../errors/AppError";

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

if (!JWT_SECRET || !JWT_EXPIRES_IN) {
  throw new AppError("Credenciais de autenticação nao configuradas", 500);
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(
    payload,
    JWT_SECRET as string,
    {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions,
  );
}

export function verificarToken(token: string): TokenPayload {
  const payload = jwt.verify(token, JWT_SECRET as string) as TokenPayload;
  return payload;
}
