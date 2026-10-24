import { Request, Response } from "express";
import { LoginUserDTO } from "../dtos/LoginUserDTO";
import { AuthService } from "../services/AuthService";
import { CreateUserDTO } from "../dtos/CreateUserDTO";

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response): Promise<Response> {
    const userData = req.body as CreateUserDTO;

    const user = await this.authService.register(userData);

    return res.status(201).json(user);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const dados = req.body as LoginUserDTO;

    const resultado = await this.authService.login(dados);

    return res.status(200).json(resultado);
  }
}
