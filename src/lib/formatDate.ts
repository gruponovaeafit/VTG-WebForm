/**
 * Formatea fechas de la DB (guardadas en UTC vía now() de Supabase)
 * a hora de Colombia (America/Bogota).
 */
export function formatDateColombia(value: unknown): string {
  if (value == null || value === "") return "N/A";

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else {
    const raw = String(value).trim();
    // timestamp without time zone de Postgres → interpretarlo como UTC
    const hasTz = /[zZ]|[+-]\d{2}:?\d{2}$/.test(raw);
    const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
    date = new Date(hasTz ? normalized : `${normalized}Z`);
  }

  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
