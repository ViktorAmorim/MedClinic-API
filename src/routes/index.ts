import { Router } from "express";
import { authRoutes } from "../routes/auth.routes";
import { userRoutes } from "../routes/user.routes";
import { adminRoutes } from "./admin.routes";
import { especialidadeRoutes } from "./especialidade.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/especialidades", especialidadeRoutes);
routes.use("/admin", adminRoutes);

export { routes };
