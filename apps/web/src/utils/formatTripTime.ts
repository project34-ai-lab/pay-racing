export function formatTripTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);

  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(date);
}
