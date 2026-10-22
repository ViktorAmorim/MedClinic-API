import { Router } from "express";
import { EspecialidadeController } from "../controllers/EspecialidadeController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";
import { CreateEspecialidadeDTO } from "../dtos/CreateEspecialidadeDTO";
import { validateDTO } from "../middlewares/validateDTO";
import { UserRole } from "../entities/User";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UpdateEspecialidadeDTO } from "../dtos/UpdateEspecialidadeDTO";
import { validateUUID } from "../middlewares/validateUUID";

const especialidadeRoutes = Router();
const especialidadeController = new EspecialidadeController();

/**
 * @swagger
 * /especialidades:
 *   get:
 *     summary: Listar especialidades cadastradas
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Número da página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Quantidade de especialidades por página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           default: 10
 *     responses:
 *       200:
 *         description: Especialidades listadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Especialidade'
 *                 total:
 *                   type: integer
 *                 pagina:
 *                   type: integer
 *                 limite:
 *                   type: integer
 *                 totalPaginas:
 *                   type: integer
 *       400:
 *         description: Parâmetros de paginação inválidos.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       500:
 *         description: Erro interno do servidor.
 */
especialidadeRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  asyncHandler((req, res) => especialidadeController.listarTodas(req, res)),
);

/**
 * @swagger
 * /especialidades/{id}:
 *   get:
 *     summary: Buscar especialidade por ID
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID da especialidade.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Especialidade encontrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Especialidade'
 *       400:
 *         description: ID inválido. Informe um UUID válido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       404:
 *         description: Especialidade não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
especialidadeRoutes.get(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  asyncHandler((req, res) => especialidadeController.buscarPorId(req, res)),
);

/**
 * @swagger
 * /especialidades:
 *   post:
 *     summary: Cadastrar nova especialidade
 *     description: Rota acessivel somente por usuario com a role ADMIN.
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEspecialidadeDTO'
 *     responses:
 *       201:
 *         description: Especialidade cadastrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Especialidade'
 *       400:
 *         description: Dados de entrada inválidos.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de administrador.
 *       409:
 *         description: Especialidade ja cadastrada.
 *       500:
 *         description: Erro interno do servidor.
 */
especialidadeRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateDTO(CreateEspecialidadeDTO),
  asyncHandler((req, res) => especialidadeController.criar(req, res)),
);

/**
 * @swagger
 * /especialidades/{id}:
 *   put:
 *     summary: Atualizar uma especialidade
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID da especialidade.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEspecialidadeDTO'
 *     responses:
 *       200:
 *         description: Especialidade atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Especialidade'
 *       400:
 *         description: ID ou dados da especialidade inválidos.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       404:
 *         description: Especialidade não encontrada.
 *       409:
 *         description: Nome de especialidade já cadastrado.
 *       500:
 *         description: Erro interno do servidor.
 */
especialidadeRoutes.put(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateUUID,
  validateDTO(UpdateEspecialidadeDTO),
  asyncHandler((req, res) => especialidadeController.atualizar(req, res)),
);

/**
 * @swagger
 * /especialidades/{id}:
 *   delete:
 *     summary: Excluir uma especialidade
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID da especialidade.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Especialidade excluída com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Especialidade excluida com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       404:
 *         description: Especialidade não encontrada.
 *       409:
 *         description: Especialidade possui médicos vinculados.
 *       500:
 *         description: Erro interno do servidor.
 */
especialidadeRoutes.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateUUID,
  asyncHandler((req, res) => especialidadeController.excluir(req, res)),
);

export { especialidadeRoutes };
