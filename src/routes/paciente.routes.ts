import { Router } from "express";
import { PacienteController } from "../controllers/PacienteController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserRole } from "../entities/User";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { validateDTO } from "../middlewares/validateDTO";
import { asyncHandler } from "../middlewares/asyncHandler";
import { CreatePacienteDTO } from "../dtos/CreatePacienteDTO";
import { UpdatePacienteDTO } from "../dtos/UpdatePacienteDTO";
import { validateUUID } from "../middlewares/validateUUID";
import { VincularPacienteDTO } from "../dtos/VincularPacienteDTO";

const pacienteRoutes = Router();
const pacienteController = new PacienteController();

/**
 * @swagger
 * /pacientes:
 *   post:
 *     summary: Cadastrar um paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePacienteDTO'
 *     responses:
 *       201:
 *         description: Paciente cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: Dados inválidos ou data de nascimento futura.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       409:
 *         description: CPF ou e-mail já cadastrado.
 *       500:
 *         description: Erro interno do servidor.
 */
pacienteRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateDTO(CreatePacienteDTO),
  asyncHandler((req, res) => pacienteController.criar(req, res)),
);

/**
 * @swagger
 * /pacientes/vincular:
 *   post:
 *     summary: Vincular um usuário existente como paciente
 *     description: >
 *       Permite que um administrador ou atendente vincule um usuário
 *       existente, sem perfil atribuído (role null), a um novo cadastro
 *       de paciente. O usuário mantém seu ID original e recebe
 *       automaticamente a role PACIENTE.
 *       Não permite vincular usuários que já possuem outro perfil
 *       ou que já estejam cadastrados como pacientes.
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VincularPacienteDTO'
 *     responses:
 *       201:
 *         description: Usuário vinculado como paciente com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *             example:
 *               id: "ee17aa1d-fdd9-4b35-8b5a-dc1fd857e389"
 *               cpf: "123.456.789-09"
 *               telefone: "48999999999"
 *               dataNascimento: "1998-05-15T00:00:00.000Z"
 *               user:
 *                 id: "d82c1dd8-4fad-420f-b2f6-90072de1baad"
 *                 nome: "João Silva"
 *                 email: "joao@example.com"
 *                 role: "PACIENTE"
 *                 criado_em: "2026-10-24T03:58:32.590Z"
 *       400:
 *         description: Dados inválidos ou data de nascimento futura.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       404:
 *         description: Usuário não encontrado.
 *       409:
 *         description: Usuário já possui perfil, já está vinculado ou CPF já cadastrado.
 *       500:
 *         description: Erro interno do servidor.
 */
pacienteRoutes.post(
  "/vincular",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateDTO(VincularPacienteDTO),
  asyncHandler((req, res) => pacienteController.vincular(req, res)),
);

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Listar pacientes cadastrados
 *     tags: [Pacientes]
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
 *         description: Quantidade de pacientes por página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           default: 10
 *       - in: query
 *         name: nome
 *         description: Filtrar pacientes pelo nome.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pacientes listados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Paciente'
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
pacienteRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  asyncHandler((req, res) => pacienteController.listar(req, res)),
);

/**
 * @swagger
 * /pacientes/{id}:
 *   get:
 *     summary: Buscar paciente por ID
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do paciente.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       404:
 *         description: Paciente não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
pacienteRoutes.get(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  asyncHandler((req, res) => pacienteController.buscarPorId(req, res)),
);

/**
 * @swagger
 * /pacientes/{id}:
 *   put:
 *     summary: Atualizar um paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do paciente.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePacienteDTO'
 *     responses:
 *       200:
 *         description: Paciente atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: ID, dados inválidos ou data de nascimento futura.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       404:
 *         description: Paciente não encontrado.
 *       409:
 *         description: CPF ou e-mail já cadastrado.
 *       500:
 *         description: Erro interno do servidor.
 */
pacienteRoutes.put(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  validateDTO(UpdatePacienteDTO),
  asyncHandler((req, res) => pacienteController.atualizar(req, res)),
);

/**
 * @swagger
 * /pacientes/{id}:
 *   delete:
 *     summary: Excluir um paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do paciente.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Paciente excluido com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de acesso.
 *       404:
 *         description: Paciente não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
pacienteRoutes.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateUUID,
  asyncHandler((req, res) => pacienteController.excluir(req, res)),
);

export { pacienteRoutes };
