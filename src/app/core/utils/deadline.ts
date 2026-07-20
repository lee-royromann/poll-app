const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Calendar days from today until the end date, so a survey stays open for its whole
 * last day instead of expiring at midnight. Zero means it ends today.
 */
function daysUntil(endDate: string): number {
  const end = new Date(`${endDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - today.getTime()) / MS_PER_DAY);
}

export function hasEnded(endDate: string | null): boolean {
  return endDate !== null && daysUntil(endDate) < 0;
}

export function endsLabel(endDate: string | null): string | null {
  if (endDate === null) {
    return null;
  }
  const days = daysUntil(endDate);
  if (days < 0) {
    return 'Ended';
  }
  return days <= 1 ? 'Ends in 1 Day' : `Ends in ${days} Days`;
}
