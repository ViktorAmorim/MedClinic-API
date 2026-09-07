import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ message: "Nome, email e senha são obrigatórios" });
    }

    const userService = new UserService();
    const user = await userService.createUser({ nome, email, senha });

    const { senha: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  }

  //async login(req: Request, res: Response): Promise<Response> {}
}
