// Configuração do PM2 para executar a API e o frontend da plataforma Mentalidade.
// Uso: pm2 startOrReload ecosystem.config.cjs
// As variáveis sensíveis (DATABASE_URL, JWT_SECRET, VITE_API_URL, CORS_ORIGIN...)
// devem ser definidas nos arquivos .env de cada aplicação.
const path = require("path");

// Diretório onde os logs das aplicações serão gravados.
const logsDir = path.join(__dirname, "logs");

module.exports = {
  apps: [
    {
      name: "mentalidade-api",
      cwd: path.join(__dirname, "apps/api"),
      script: "dist/server.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      restart_delay: 3000,
      max_memory_restart: "512M",
      time: true,
      merge_logs: true,
      out_file: path.join(logsDir, "mentalidade-api.out.log"),
      error_file: path.join(logsDir, "mentalidade-api.err.log"),
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "mentalidade-web",
      script: "serve",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      max_memory_restart: "256M",
      time: true,
      merge_logs: true,
      out_file: path.join(logsDir, "mentalidade-web.out.log"),
      error_file: path.join(logsDir, "mentalidade-web.err.log"),
      env: {
        NODE_ENV: "production",
        PM2_SERVE_PATH: path.join(__dirname, "apps/web/dist"),
        PM2_SERVE_PORT: 5180,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html",
      },
    },
  ],
};
