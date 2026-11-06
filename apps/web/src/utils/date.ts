// Utilitários de data no formato AAAA-MM-DD para o frontend.

// Retorna a data de hoje (AAAA-MM-DD) no fuso local.
export function todayString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

// Soma (ou subtrai) dias a uma data no formato AAAA-MM-DD.
export function shiftDate(date: string, deltaDays: number): string {
  const base = new Date(`${date}T00:00:00.000Z`);
  base.setUTCDate(base.getUTCDate() + deltaDays);
  return base.toISOString().slice(0, 10);
}

// Gera os últimos N dias (do mais antigo para o mais recente).
export function lastNDays(days: number, end = todayString()): string[] {
  return Array.from({ length: days }, (_, index) => shiftDate(end, index - (days - 1)));
}
