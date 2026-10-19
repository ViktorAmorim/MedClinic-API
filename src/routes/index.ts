import { Router } from "express";
import { authRoutes } from "../routes/auth.routes";
import { userRoutes } from "../routes/user.routes";
import { adminRoutes } from "./admin.routes";
import { especialidadeRoutes } from "./especialidade.routes";
import { medicoRoutes } from "./medico.routes";
import { pacienteRoutes } from "./paciente.routes";
import { consultaRoutes } from "./consulta.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/medicos", medicoRoutes);
routes.use("/pacientes", pacienteRoutes);
routes.use("/especialidades", especialidadeRoutes);
routes.use("/admin", adminRoutes);
routes.use("/consultas", consultaRoutes);

export { routes };
