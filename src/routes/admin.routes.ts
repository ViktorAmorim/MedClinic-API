import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";
import { UserRole } from "../entities/User";

const adminRoutes = Router();
const adminController = new AdminController();

/**
 * @swagger
 * /admin/ping:
 *   get:
 *     summary: Verificar acesso á area administrativa.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Área administrativa acessada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Area administrativa acessada com sucesso"
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de administrador.
 *       500:
 *         description: Erro interno do servidor.
 */
adminRoutes.get(
  "/ping",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  asyncHandler((req, res) => adminController.ping(req, res)),
);

export { adminRoutes };
