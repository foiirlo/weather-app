import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Text, View } from 'react-native';

import { FavoriteBadge } from '@/src/components/FavoriteBadge';
import { getWeatherParts } from '@/src/constants/weatherCodes';
import type { CurrentWeather } from '@/src/types/weather';
import { formatTemperature } from '@/src/utils/format';

type CurrentWeatherCardProps = {
  cityName: string;
  weather: CurrentWeather | null;
  isLoading: boolean;
  error: Error | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

// 프레젠테이션 전용. props로만 데이터를 받아 렌더링만 담당.
export function CurrentWeatherCard({
  cityName,
  weather,
  isLoading,
  error,
  isFavorite,
  onToggleFavorite,
}: CurrentWeatherCardProps) {
  const weatherParts = weather ? getWeatherParts(weather.weatherCode) : null;

  return (
    <View className="overflow-hidden rounded-2xl border border-[#1e2d4a]">
      <LinearGradient
        colors={['#0e1629', '#111827']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24 }}
      >
        <View className="flex-row items-start justify-between">
          <Text className="text-xl font-semibold text-[#e8edf8]">{cityName}</Text>
          <FavoriteBadge isFavorite={isFavorite} onPress={onToggleFavorite} />
        </View>

        {isLoading && <ActivityIndicator className="mt-6" color="#38bdf8" />}
        {!isLoading && error && (
          <Text className="mt-6 text-sm text-red-400">날씨 정보를 불러오지 못했습니다</Text>
        )}
        {!isLoading && !error && weather && weatherParts && (
          <View className="mt-6 flex-row items-center justify-between">
            <Text className="text-5xl text-[#e8edf8]">{formatTemperature(weather.temperature)}</Text>
            {weatherParts.emoji ? <Text style={{ fontSize: 48 }}>{weatherParts.emoji}</Text> : null}
          </View>
        )}

        {!isLoading && !error && weather && weatherParts && (
          <View className="mt-6 flex-row items-center justify-between">
            <View className="flex-row gap-6">
              <View>
                <Text className="text-xs text-[#6b7fa3]">체감</Text>
                <Text className="text-[#e8edf8]">{formatTemperature(weather.apparentTemperature)}</Text>
              </View>
              <View>
                <Text className="text-xs text-[#6b7fa3]">습도</Text>
                <Text className="text-[#e8edf8]">{Math.round(weather.humidity)}%</Text>
              </View>
              <View>
                <Text className="text-xs text-[#6b7fa3]">바람</Text>
                <Text className="text-[#e8edf8]">{Math.round(weather.windSpeed)}km/h</Text>
              </View>
            </View>

            <View className="rounded-lg border border-[#1e2d4a] px-3 py-1">
              <Text className="text-sm text-[#94b4d4]">{weatherParts.text}</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}
