import { Router } from "express";
import { RelatorioController } from "../controllers/RelatorioController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "../entities/User";
import { asyncHandler } from "../middlewares/asyncHandler";

const relatorioRoutes = Router();
const relatorioController = new RelatorioController();

relatorioRoutes.get(
  "/consultas-por-status",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  asyncHandler((req, res) => relatorioController.consultasPorStatus(req, res)),
);

relatorioRoutes.get(
  "/consultas-por-medico",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  asyncHandler((req, res) => relatorioController.consultasPorMedico(req, res)),
);

relatorioRoutes.get(
  "/medicos-por-especialidade",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  asyncHandler((req, res) =>
    relatorioController.medicosPorEspecialidade(req, res),
  ),
);

relatorioRoutes.get(
  "/pacientes-com-consultas-agendadas",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  asyncHandler((req, res) =>
    relatorioController.pacientesComConsultasAgendadas(req, res),
  ),
);

export { relatorioRoutes };
