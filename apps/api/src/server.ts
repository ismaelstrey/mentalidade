import fs from "node:fs";
import path from "node:path";
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

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // Permite as capas e os players oficiais de vídeo usados no embed sob demanda.
        "img-src": ["'self'", "data:", "https:"],
        "frame-src": [
          "https://www.youtube-nocookie.com",
          "https://www.instagram.com",
          "https://www.tiktok.com",
          "https://www.facebook.com",
        ],
        "connect-src": ["'self'", env.CORS_ORIGIN],
      },
    },
    // Necessário para permitir a incorporação de vídeos de outras origens.
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// Documentação da API.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas da aplicação.
app.use("/api", router);

// Serve o frontend compilado quando presente (deploy em contêiner único).
if (fs.existsSync(env.WEB_DIST_DIR)) {
  app.use(express.static(env.WEB_DIST_DIR));

  // Fallback do SPA: rotas do frontend devolvem o index.html.
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(path.join(env.WEB_DIST_DIR, "index.html"));
  });
}

// Tratamento de rotas inexistentes e erros.
app.use(notFoundHandler);
app.use(errorHandler);

// Inicializa o servidor HTTP.
app.listen(env.PORT, () => {
  console.log(`API disponível em http://localhost:${env.PORT}`);
  console.log(`Documentação em http://localhost:${env.PORT}/api-docs`);
});
