import { Router } from "express";
import { authRoutes } from "../routes/auth.routes";
import { userRoutes } from "../routes/user.routes";
import { adminRoutes } from "./admin.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/admin", adminRoutes);

export { routes };
