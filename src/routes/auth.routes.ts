import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateDTO } from "../middlewares/validateDTO";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { asyncHandler } from "../middlewares/asyncHandler";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post(
  "/register",
  validateDTO(CreateUserDTO),
  asyncHandler((req, res) => authController.register(req, res)),
);

export { authRoutes };
