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

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export function formatDateTitle(dateStr: string, dayOfWeek: string, isNext: boolean): string {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDate();
  const prefix = isNext ? "Next" : "This";
  return `${prefix} ${dayOfWeek} the ${day}${getOrdinalSuffix(day)}`;
}
