import { Router } from "express";
import { ConsultaController } from "../controllers/ConsultaController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "../entities/User";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AgendarConsultaDTO } from "../dtos/AgendarConsultaDTO";
import { validateDTO } from "../middlewares/validateDTO";

const consultaRoutes = Router();
const consultaController = new ConsultaController();

consultaRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateDTO(AgendarConsultaDTO),
  asyncHandler((req, res) => consultaController.agendar(req, res)),
);

export { consultaRoutes };
