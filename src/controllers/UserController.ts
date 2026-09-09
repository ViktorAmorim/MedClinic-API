import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AppError } from "../errors/AppError";
import { removePassword } from "../utils/removePassword";

export class UserController {
  async me(req: Request, res: Response): Promise<Response> {
    const userService = new UserService();
    const user = await userService.findById(req.user.sub);

    if (!user) {
      throw new AppError("Usuario nao encontrado", 404);
    }

    return res.status(200).json(removePassword(user));
  }
}
