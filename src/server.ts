import "reflect-metadata";
import "dotenv/config";
import express from "express";

import { AppDataSource } from "./database/data-source";
// import { routes } from "./routes";

const app = express();

app.use(express.json());
// futuramente: app.use(routes);

const localPort = process.env.PORT;

AppDataSource.initialize()
  .then(() => {
    app.listen(localPort, () => {
      console.log(`Server iniciado na porta: ${localPort}`);
    });
  })
  .catch((error) => console.log(error));
