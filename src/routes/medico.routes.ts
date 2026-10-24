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
import { VincularMedicoDTO } from "../dtos/VincularMedicoDTO";

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
 * /medicos/vincular:
 *   post:
 *     summary: Vincular um usuário existente como médico
 *     description: >
 *       Permite que um administrador vincule um usuário existente,
 *       com role null, a um novo cadastro de médico.
 *       O usuário mantém seu ID original e recebe automaticamente
 *       a role MEDICO.
 *       O CRM deve ser único e a especialidade deve estar cadastrada.
 *       Não permite vincular usuários que já possuem outro perfil
 *       ou cadastro de médico.
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VincularMedicoDTO'
 *     responses:
 *       201:
 *         description: Usuário vinculado como médico com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *             example:
 *               id: "ee17aa1d-fdd9-4b35-8b5a-dc1fd857e389"
 *               crm: "123456-SC"
 *               telefone: "48999999999"
 *               user:
 *                 id: "94888c65-850a-4143-9aaf-c9330117ad1f"
 *                 nome: "Dr. Marcos"
 *                 email: "marcos@example.com"
 *                 role: "MEDICO"
 *                 criado_em: "2026-10-24T04:15:10.236Z"
 *               especialidade:
 *                 id: "d82c1dd8-4fad-420f-b2f6-90072de1baad"
 *                 nome: "Cardiologia"
 *       400:
 *         description: Dados inválidos, UUID inválido ou campos obrigatórios ausentes.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso. Apenas ADMIN pode vincular médicos.
 *       404:
 *         description: Usuário ou especialidade não encontrado.
 *       409:
 *         description: Usuário já possui perfil, já está vinculado ou CRM já cadastrado.
 *       500:
 *         description: Erro interno do servidor.
 */
medicoRoutes.post(
  "/vincular",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateDTO(VincularMedicoDTO),
  asyncHandler((req, res) => medicoController.vincular(req, res)),
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
