import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validateDTO } from "../middlewares/validateDTO";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { LoginUserDTO } from "../dtos/LoginUserDTO";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post(
  "/register",
  validateDTO(CreateUserDTO),
  asyncHandler((req, res) => authController.register(req, res)),
);

authRoutes.post(
  "/login",
  validateDTO(LoginUserDTO),
  asyncHandler((req, res) => authController.login(req, res)),
);

export { authRoutes };
