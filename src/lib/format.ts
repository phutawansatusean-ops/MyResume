/** "2007-10-07" → "7 Oct 2007". Falls back to the raw string if it isn't a valid date. */
export function formatBirthDate(value: string): string {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
