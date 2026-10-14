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

medicoRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateDTO(CreateMedicoDTO),
  asyncHandler((req, res) => medicoController.criar(req, res)),
);

medicoRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  asyncHandler((req, res) => medicoController.listar(req, res)),
);

medicoRoutes.get(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ATENDENTE),
  validateUUID,
  asyncHandler((req, res) => medicoController.buscarPorId(req, res)),
);

medicoRoutes.put(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateUUID,
  validateDTO(UpdateMedicoDTO),
  asyncHandler((req, res) => medicoController.atualizar(req, res)),
);

medicoRoutes.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validateUUID,
  asyncHandler((req, res) => medicoController.excluir(req, res)),
);

export { medicoRoutes };
