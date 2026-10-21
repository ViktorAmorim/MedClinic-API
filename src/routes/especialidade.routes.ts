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

especialidadeRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  asyncHandler((req, res) => especialidadeController.listarTodas(req, res)),
);

especialidadeRoutes.get(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  asyncHandler((req, res) => especialidadeController.buscarPorId(req, res)),
);

especialidadeRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateDTO(CreateEspecialidadeDTO),
  asyncHandler((req, res) => especialidadeController.criar(req, res)),
);

especialidadeRoutes.put(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateUUID,
  validateDTO(UpdateEspecialidadeDTO),
  asyncHandler((req, res) => especialidadeController.atualizar(req, res)),
);

especialidadeRoutes.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateUUID,
  asyncHandler((req, res) => especialidadeController.excluir(req, res)),
);

export { especialidadeRoutes };
