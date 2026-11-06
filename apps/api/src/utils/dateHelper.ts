// Utilitários de manipulação de datas no formato AAAA-MM-DD.

// Converte uma data (AAAA-MM-DD ou ISO) no início do dia em UTC.
export function toDateOnly(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}

// Formata uma data no padrão AAAA-MM-DD (UTC).
export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Retorna a data de hoje (AAAA-MM-DD) no fuso local do servidor.
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
