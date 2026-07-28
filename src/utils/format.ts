// 포맷터 등 순수 함수 모음

export function formatTemperature(celsius: number): string {
  return `${Math.round(celsius)}°`;
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export function formatDayLabel(dateString: string): string {
  const date = new Date(dateString);
  return WEEKDAY_LABELS[date.getDay()];
}

export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function formatWeekdayLabel(dateString: string): string {
  if (isToday(dateString)) return '오늘';
  const date = new Date(dateString);
  return `${WEEKDAY_LABELS[date.getDay()]}요일`;
}

export function formatMonthDay(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
