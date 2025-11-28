import type { ClockData } from "./types";

export function getClockData(): ClockData {
  const now = new Date();

  return {
    time: now.toLocaleTimeString(),
    date: now.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
