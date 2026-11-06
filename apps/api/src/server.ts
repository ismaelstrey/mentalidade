import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./docs/swagger";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware";
import { router } from "./routes";
import { env } from "./utils/env";

// Cria e configura a instância do Express.
const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// Documentação da API.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas da aplicação.
app.use("/api", router);

// Tratamento de rotas inexistentes e erros.
app.use(notFoundHandler);
app.use(errorHandler);

// Inicializa o servidor HTTP.
app.listen(env.PORT, () => {
  console.log(`API disponível em http://localhost:${env.PORT}`);
  console.log(`Documentação em http://localhost:${env.PORT}/api-docs`);
});
