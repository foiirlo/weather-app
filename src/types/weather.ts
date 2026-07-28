// Open-Meteo API 응답 및 도메인 타입

export type City = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  observedAt: string;
};

export type DailyForecast = {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
};
