import { Text, View } from 'react-native';

import { getWeatherParts } from '@/src/constants/weatherCodes';
import type { DailyForecast } from '@/src/types/weather';
import { formatMonthDay, formatTemperature, formatWeekdayLabel } from '@/src/utils/format';

type ForecastRowProps = {
  forecast: DailyForecast;
};

// 프레젠테이션 전용. props로만 데이터를 받아 렌더링만 담당.
export function ForecastRow({ forecast }: ForecastRowProps) {
  const weatherParts = getWeatherParts(forecast.weatherCode);

  return (
    <View className="flex-row items-center justify-between rounded-2xl border border-[#1e2d4a] bg-[#0e1629] px-4 py-3">
      <View>
        <Text className="text-[#e8edf8]">{formatMonthDay(forecast.date)}</Text>
        <Text className="mt-0.5 text-xs text-[#6b7fa3]">{formatWeekdayLabel(forecast.date)}</Text>
      </View>

      <View className="flex-row items-center gap-1.5">
        <Text style={{ fontSize: 20 }}>{weatherParts.emoji}</Text>
        <Text className="text-sm text-[#94b4d4]">{weatherParts.text}</Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Text className="text-lg font-semibold text-[#e8edf8]">
          {formatTemperature(forecast.temperatureMax)}
        </Text>
        <Text className="text-[#6b7fa3]">{formatTemperature(forecast.temperatureMin)}</Text>
      </View>
    </View>
  );
}
