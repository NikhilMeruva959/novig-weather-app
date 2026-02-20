export function getDateForDayOfWeek(dayOfWeek: string): string {
  const dayMap: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  const targetDayNum = dayMap[dayOfWeek] ?? 0;
  const today = new Date();
  const currentDayNum = today.getDay();
  const daysUntil = (targetDayNum - currentDayNum + 7) % 7;
  const resultDate = new Date(today);
  resultDate.setDate(today.getDate() + daysUntil);
  return resultDate.toISOString().slice(0, 10);
}
