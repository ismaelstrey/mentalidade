// Serviço responsável por informar o estado da aplicação.
export const healthService = {
  getStatus(): { status: string; uptime: number; timestamp: string } {
    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  },
};
