import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";
import { UserController } from "../controllers/UserController";

const userRoutes = Router();
const userController = new UserController();

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Consultar dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
userRoutes.get(
  "/me",
  authMiddleware,
  asyncHandler((req, res) => {
    return userController.me(req, res);
  }),
);

export { userRoutes };
