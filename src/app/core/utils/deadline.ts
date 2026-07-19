const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Rounded up so a survey running out later today still counts as one full day. */
export function daysUntil(endDate: string | null): number | null {
  if (!endDate) {
    return null;
  }
  const remaining = new Date(endDate).getTime() - Date.now();
  return Math.ceil(remaining / MS_PER_DAY);
}

/** Null only for surveys without a deadline, which is the one case with nothing to show. */
export function endsLabel(endDate: string | null): string | null {
  const days = daysUntil(endDate);
  if (days === null) {
    return null;
  }
  if (days <= 0) {
    return 'Ended';
  }
  return days === 1 ? 'Ends in 1 Day' : `Ends in ${days} Days`;
}
