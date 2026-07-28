import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { FavoriteBadge } from '@/src/components/FavoriteBadge';
import { getWeatherParts } from '@/src/constants/weatherCodes';
import type { CurrentWeather } from '@/src/types/weather';

type CityCardProps = {
  cityName: string;
  weather: CurrentWeather | null;
  isLoading: boolean;
  error: Error | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
};

// 프레젠테이션 전용 컴포넌트. props로만 데이터를 받고 fetch/상태 로직은 갖지 않음.
export function CityCard({
  cityName,
  weather,
  isLoading,
  error,
  isFavorite,
  onToggleFavorite,
  onPress,
}: CityCardProps) {
  const weatherParts = weather ? getWeatherParts(weather.weatherCode) : null;

  return (
    <Pressable onPress={onPress} className="active:opacity-90">
      <View className="overflow-hidden rounded-2xl border border-[#1e2d4a]">
        <LinearGradient
          colors={['#0e1629', '#111827']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 16 }}
        >
          <View className="flex-row items-start justify-between">
            <Text className="text-xl font-semibold text-[#e8edf8]">{cityName}</Text>
            <FavoriteBadge isFavorite={isFavorite} onPress={onToggleFavorite} />
          </View>

          {isLoading && <ActivityIndicator className="mt-4 self-start" color="#38bdf8" />}
          {!isLoading && error && (
            <Text className="mt-4 text-sm text-red-400">날씨 정보를 불러오지 못했습니다</Text>
          )}

          {!isLoading && !error && weather && (
            <>
              <View className="mt-3 flex-row items-center justify-between">
                <View className="flex-row items-start">
                  <Text className="text-5xl text-[#e8edf8]">{Math.round(weather.temperature)}</Text>
                  <Text className="ml-1 mt-1 text-lg text-[#94b4d4]">°</Text>
                </View>
                {weatherParts && weatherParts.emoji ? (
                  <Text style={{ fontSize: 48 }}>{weatherParts.emoji}</Text>
                ) : null}
              </View>

              <View className="mt-3 flex-row items-center justify-between">
                <Text className="text-sm text-[#94b4d4]">습도 {Math.round(weather.humidity)}%</Text>
                {weatherParts && (
                  <View className="rounded-lg border border-[#1e2d4a] px-3 py-1">
                    <Text className="text-sm text-[#94b4d4]">{weatherParts.text}</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </LinearGradient>
      </View>
    </Pressable>
  );
}
