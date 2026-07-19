const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Rounded up so a survey running out later today still counts as one full day. */
export function daysUntil(endDate: string | null): number | null {
  if (!endDate) {
    return null;
  }
  const remaining = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(remaining / MS_PER_DAY));
}

export function endsLabel(endDate: string | null): string | null {
  const days = daysUntil(endDate);
  if (days === null) {
    return null;
  }
  return days === 1 ? 'Ends in 1 Day' : `Ends in ${days} Days`;
}
