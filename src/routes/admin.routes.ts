import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";
import { UserRole } from "../entities/User";

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.get(
  "/ping",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  asyncHandler((req, res) => adminController.ping(req, res)),
);

export { adminRoutes };
