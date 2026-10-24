import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";
import { removePassword } from "../utils/removePassword";

export class AdminController {
  private adminService = new AdminService();

  async ping(req: Request, res: Response): Promise<Response> {
    return res
      .status(200)
      .json({ message: "Area administrativa acessada com sucesso" });
  }

  async atribuirRole(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    const usuario = await this.adminService.atribuirRole(id, req.body);

    return res.status(200).json(removePassword(usuario));
  }
}
