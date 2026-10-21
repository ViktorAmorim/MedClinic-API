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

consultaRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  asyncHandler((req, res) => consultaController.listarTodas(req, res)),
);

consultaRoutes.get(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  asyncHandler((req, res) => consultaController.buscarPorId(req, res)),
);

consultaRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateDTO(AgendarConsultaDTO),
  asyncHandler((req, res) => consultaController.agendar(req, res)),
);

consultaRoutes.patch(
  "/:id/atendimento",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  validateDTO(RegistrarAtendimentoDTO),
  asyncHandler((req, res) => consultaController.realizarAtendimento(req, res)),
);

consultaRoutes.patch(
  "/:id/cancelamento",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  asyncHandler((req, res) => consultaController.cancelarConsulta(req, res)),
);

export { consultaRoutes };
