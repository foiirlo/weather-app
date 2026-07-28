import type { CurrentWeather, DailyForecast } from '@/src/types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// 순수 fetch 함수. UI/상태를 모르는 데이터 레이어.
// TODO: Open-Meteo 실제 응답 필드에 맞춰 파싱 로직 구현.
export async function fetchCurrentWeather(
  latitude: number,
  longitude: number
): Promise<CurrentWeather> {
  const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&timezone=auto`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch current weather: ${response.status}`);
  }

  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    observedAt: data.current.time,
  };
}

// TODO: Open-Meteo 실제 응답 필드에 맞춰 파싱 로직 구현.
export async function fetchWeeklyForecast(
  latitude: number,
  longitude: number
): Promise<DailyForecast[]> {
  const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch weekly forecast: ${response.status}`);
  }

  const data = await response.json();

  return data.daily.time.map((date: string, index: number) => ({
    date,
    weatherCode: data.daily.weather_code[index],
    temperatureMax: data.daily.temperature_2m_max[index],
    temperatureMin: data.daily.temperature_2m_min[index],
    precipitationProbability: data.daily.precipitation_probability_max[index],
  }));
}
