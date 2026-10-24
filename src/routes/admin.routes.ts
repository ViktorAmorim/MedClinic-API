import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";
import { UserRole } from "../entities/User";
import { validateUUID } from "../middlewares/validateUUID";
import { validateDTO } from "../middlewares/validateDTO";
import { AtribuirRoleDTO } from "../dtos/AtribuirRoleDTO";

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

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Atribuir perfil a um usuário sem perfil
 *     description: >
 *       Permite que um administrador atribua o perfil ADMIN ou
 *       ATENDENTE a um usuário existente com role null.
 *       Não permite alterar usuários que já possuem perfil.
 *       Os perfis MEDICO e PACIENTE são atribuídos exclusivamente
 *       pelos respectivos endpoints de vinculação.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do usuário que receberá o perfil.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtribuirRoleDTO'
 *     responses:
 *       200:
 *         description: Perfil atribuído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: UUID inválido ou perfil não permitido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão. Apenas ADMIN.
 *       404:
 *         description: Usuário não encontrado.
 *       409:
 *         description: O usuário já possui um perfil atribuído.
 *       500:
 *         description: Erro interno do servidor.
 */
adminRoutes.patch(
  "/users/:id/role",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateUUID,
  validateDTO(AtribuirRoleDTO),
  asyncHandler((req, res) => adminController.atribuirRole(req, res)),
);

export { adminRoutes };
