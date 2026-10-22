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
app.use(routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// sempre no final das rotas
app.use(errorMiddleware);

const localPort = process.env.PORT;

AppDataSource.initialize()
  .then(() => {
    app.listen(localPort, () => {
      console.log(
        `Servidor iniciado na porta: http://localhost:${localPort} \n
Swagger UI: http://localhost:${localPort}/api-docs`,
      );
    });
  })
  .catch((error) => console.log(error));
