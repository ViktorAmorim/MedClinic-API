import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";
import { UserController } from "../controllers/UserController";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get(
  "/me",
  authMiddleware,
  asyncHandler((req, res) => {
    return userController.me(req, res);
  }),
);

export { userRoutes };
