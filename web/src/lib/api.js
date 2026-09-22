export const API_URL = "https://api.sricharan3435.workers.dev";

export function formatDate(date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export function getExcerpt(content, length = 180) {
  return content.length <= length ? content : `${content.slice(0, length).trim()}…`;
}
