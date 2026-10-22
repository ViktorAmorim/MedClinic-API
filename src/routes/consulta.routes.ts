import { Router } from "express";
import { ConsultaController } from "../controllers/ConsultaController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "../entities/User";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AgendarConsultaDTO } from "../dtos/AgendarConsultaDTO";
import { validateDTO } from "../middlewares/validateDTO";
import { validateUUID } from "../middlewares/validateUUID";
import { RegistrarAtendimentoDTO } from "../dtos/RegistrarAtendimentoDTO";

const consultaRoutes = Router();
const consultaController = new ConsultaController();

/**
 * @swagger
 * /consultas:
 *   get:
 *     summary: Listar consultas
 *     description: Lista consultas com paginação e filtros opcionais.
 *     tags: [Consultas]
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
 *         description: Quantidade de consultas por página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           default: 10
 *       - in: query
 *         name: dataInicio
 *         description: Data inicial do filtro.
 *         schema:
 *           type: string
 *           example: "2027-05-01"
 *       - in: query
 *         name: dataFim
 *         description: Data final do filtro.
 *         schema:
 *           type: string
 *           example: "2027-05-31"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AGENDADA, REALIZADA, CANCELADA]
 *       - in: query
 *         name: medicoId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: pacienteId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Consultas listadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Consulta'
 *                 total:
 *                   type: integer
 *                 pagina:
 *                   type: integer
 *                 limite:
 *                   type: integer
 *                 totalPaginas:
 *                   type: integer
 *       400:
 *         description: Filtros ou paginação inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso negado.
 *       500:
 *         description: Erro interno do servidor.
 */
consultaRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  asyncHandler((req, res) => consultaController.listarTodas(req, res)),
);

/**
 * @swagger
 * /consultas/{id}:
 *   get:
 *     summary: Buscar consulta por ID
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID da consulta.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consulta encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consulta'
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Consulta não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
consultaRoutes.get(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  asyncHandler((req, res) => consultaController.buscarPorId(req, res)),
);

/**
 * @swagger
 * /consultas:
 *   post:
 *     summary: Agendar consulta
 *     description: Agenda uma consulta futura em intervalos de 30 minutos, sem conflito de horário para o médico.
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendarConsultaDTO'
 *     responses:
 *       201:
 *         description: Consulta agendada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consulta'
 *       400:
 *         description: Dados inválidos, data passada ou horário fora dos intervalos de 30 minutos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Médico ou paciente não encontrado.
 *       409:
 *         description: Conflito de horário para o médico.
 *       500:
 *         description: Erro interno do servidor.
 */
consultaRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateDTO(AgendarConsultaDTO),
  asyncHandler((req, res) => consultaController.agendar(req, res)),
);

/**
 * @swagger
 * /consultas/{id}/atendimento:
 *   patch:
 *     summary: Registrar atendimento
 *     description: Registra o diagnóstico e altera o status de AGENDADA para REALIZADA.
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID da consulta.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrarAtendimentoDTO'
 *     responses:
 *       200:
 *         description: Atendimento registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consulta'
 *       400:
 *         description: ID ou dados inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Consulta não encontrada.
 *       409:
 *         description: Apenas consultas agendadas podem ser realizadas.
 *       500:
 *         description: Erro interno do servidor.
 */
consultaRoutes.patch(
  "/:id/atendimento",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  validateDTO(RegistrarAtendimentoDTO),
  asyncHandler((req, res) => consultaController.realizarAtendimento(req, res)),
);

/**
 * @swagger
 * /consultas/{id}/cancelamento:
 *   patch:
 *     summary: Cancelar consulta
 *     description: Altera o status de AGENDADA para CANCELADA, sem excluir a consulta do banco de dados.
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID da consulta.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consulta cancelada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consulta'
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Consulta não encontrada.
 *       409:
 *         description: Apenas consultas agendadas podem ser canceladas.
 *       500:
 *         description: Erro interno do servidor.
 */
consultaRoutes.patch(
  "/:id/cancelamento",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  asyncHandler((req, res) => consultaController.cancelarConsulta(req, res)),
);

export { consultaRoutes };
