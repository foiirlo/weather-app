// Open-Meteo weather_code(WMO) → 한글 설명(+이모지) 매핑
// https://open-meteo.com/en/docs 의 WMO Weather interpretation codes 참고

export const WEATHER: Record<number, string> = {
  0: '맑음 ☀️', 1: '대체로 맑음 🌤️', 2: '구름 조금 ⛅', 3: '흐림 ☁️',
  45: '안개 🌫️', 48: '짙은 안개 🌫️',
  51: '약한 이슬비 🌦️', 53: '이슬비 🌦️', 55: '강한 이슬비 🌧️',
  61: '약한 비 🌧️', 63: '비 🌧️', 65: '강한 비 ⛈️',
  71: '약한 눈 🌨️', 73: '눈 🌨️', 75: '강한 눈 ❄️',
  80: '소나기 🌦️', 81: '소나기 🌧️', 82: '강한 소나기 ⛈️',
  95: '천둥번개 ⛈️', 96: '우박 동반 뇌우 ⛈️',
};

export function getWeatherLabel(code: number): string {
  return WEATHER[code] ?? '정보 없음';
}

// "구름 조금 ⛅" → { text: '구름 조금', emoji: '⛅' }. 텍스트와 이모지를 따로 표시해야 할 때 사용.
export function getWeatherParts(code: number): { text: string; emoji: string } {
  const label = getWeatherLabel(code);
  const lastSpace = label.lastIndexOf(' ');
  if (lastSpace === -1) return { text: label, emoji: '' };
  return { text: label.slice(0, lastSpace), emoji: label.slice(lastSpace + 1) };
}
