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

const pacienteRoutes = Router();
const pacienteController = new PacienteController();

pacienteRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateDTO(CreatePacienteDTO),
  asyncHandler((req, res) => pacienteController.criar(req, res)),
);

pacienteRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  asyncHandler((req, res) => pacienteController.listar(req, res)),
);

pacienteRoutes.get(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  asyncHandler((req, res) => pacienteController.buscarPorId(req, res)),
);

pacienteRoutes.put(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  validateDTO(UpdatePacienteDTO),
  asyncHandler((req, res) => pacienteController.atualizar(req, res)),
);

pacienteRoutes.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateUUID,
  asyncHandler((req, res) => pacienteController.excluir(req, res)),
);

export { pacienteRoutes };
