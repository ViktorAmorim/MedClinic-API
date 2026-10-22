import { Router } from "express";
import { MedicoController } from "../controllers/MedicoController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validateDTO } from "../middlewares/validateDTO";
import { validateUUID } from "../middlewares/validateUUID";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "../entities/User";
import { CreateMedicoDTO } from "../dtos/CreateMedicoDTO";
import { UpdateMedicoDTO } from "../dtos/UpdateMedicoDTO";

const medicoRoutes = Router();
const medicoController = new MedicoController();

/**
 * @swagger
 * /medicos:
 *   post:
 *     summary: Cadastrar um médico
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMedicoDTO'
 *     responses:
 *       201:
 *         description: Médico cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       404:
 *         description: Especialidade não encontrada.
 *       409:
 *         description: CRM ou e-mail já cadastrado.
 *       500:
 *         description: Erro interno do servidor.
 */
medicoRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateDTO(CreateMedicoDTO),
  asyncHandler((req, res) => medicoController.criar(req, res)),
);

/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Listar médicos cadastrados
 *     tags: [Médicos]
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
 *         description: Quantidade de médicos por página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           default: 10
 *       - in: query
 *         name: nome
 *         description: Filtrar médicos pelo nome.
 *         schema:
 *           type: string
 *       - in: query
 *         name: especialidadeId
 *         description: Filtrar médicos pelo UUID da especialidade.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Médicos listados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Medico'
 *                 total:
 *                   type: integer
 *                 pagina:
 *                   type: integer
 *                 limite:
 *                   type: integer
 *                 totalPaginas:
 *                   type: integer
 *       400:
 *         description: Parâmetros de paginação ou filtros inválidos.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       500:
 *         description: Erro interno do servidor.
 */
medicoRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  asyncHandler((req, res) => medicoController.listar(req, res)),
);

/**
 * @swagger
 * /medicos/{id}:
 *   get:
 *     summary: Buscar médico por ID
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do médico.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Médico encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       404:
 *         description: Médico não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
medicoRoutes.get(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  asyncHandler((req, res) => medicoController.buscarPorId(req, res)),
);

/**
 * @swagger
 * /medicos/{id}:
 *   put:
 *     summary: Atualizar um médico
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do médico.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMedicoDTO'
 *     responses:
 *       200:
 *         description: Médico atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *       400:
 *         description: ID ou dados inválidos.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       404:
 *         description: Médico ou especialidade não encontrado.
 *       409:
 *         description: CRM ou e-mail já cadastrado.
 *       500:
 *         description: Erro interno do servidor.
 */
medicoRoutes.put(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateUUID,
  validateDTO(UpdateMedicoDTO),
  asyncHandler((req, res) => medicoController.atualizar(req, res)),
);

/**
 * @swagger
 * /medicos/{id}:
 *   delete:
 *     summary: Excluir um médico
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do médico.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Médico excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Médico excluído com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       404:
 *         description: Médico não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
medicoRoutes.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateUUID,
  asyncHandler((req, res) => medicoController.excluir(req, res)),
);

export { medicoRoutes };
