import { logger } from "./config/logger";
import { requestLogger } from "./middlewares/requestLogger";
import "reflect-metadata";
import "dotenv/config";
import express from "express";

import { AppDataSource } from "./database/data-source";
import { routes } from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// sempre no final das rotas
app.use(errorMiddleware);

const localPort = process.env.PORT;

AppDataSource.initialize()
  .then(() => {
    app.listen(localPort, () => {
      logger.info(`Servidor iniciado na porta: http://localhost:${localPort}`);
      logger.info(`Swagger UI: http://localhost:${localPort}/api-docs`);
    });
  })
  .catch((error) =>
    logger.error("Erro ao inicializar a conexão com o banco de dados", error),
  );
