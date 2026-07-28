import { Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

import { CurrentWeatherCard } from '@/src/components/CurrentWeatherCard';
import { ForecastRow } from '@/src/components/ForecastRow';
import { WeeklyTempTrendChart } from '@/src/components/WeeklyTempTrendChart';
import { CITIES } from '@/src/constants/cities';
import { useCurrentWeather } from '@/src/hooks/useCurrentWeather';
import { useWeeklyForecast } from '@/src/hooks/useWeeklyForecast';
import { useFavoritesStore } from '@/src/store/useFavoritesStore';

// 도시 상세 화면. id로 도시를 조회해 현재 날씨/주간 예보를 표시.
export default function CityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const city = CITIES.find((c) => c.id === id);

  const isFavorite = useFavoritesStore((state) => (city ? state.isFavorite(city.id) : false));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const currentWeather = useCurrentWeather(city?.latitude ?? 0, city?.longitude ?? 0);
  const weeklyForecast = useWeeklyForecast(city?.latitude ?? 0, city?.longitude ?? 0);

  if (!city) {
    return (
      <View className="flex-1 items-center justify-center bg-[#080d1a]">
        <Text className="text-[#94b4d4]">도시를 찾을 수 없습니다</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#080d1a]">
      <Stack.Screen options={{ title: city.name }} />
      <FlatList
        data={weeklyForecast.data ?? []}
        keyExtractor={(item) => item.date}
        contentContainerClassName="gap-4 p-4"
        ListHeaderComponent={
          <View className="mb-4">
            <CurrentWeatherCard
              cityName={city.name}
              weather={currentWeather.data}
              isLoading={currentWeather.isLoading}
              error={currentWeather.error}
              isFavorite={isFavorite}
              onToggleFavorite={() => toggleFavorite(city.id)}
            />

            {!weeklyForecast.isLoading && !weeklyForecast.error && weeklyForecast.data && (
              <View className="mt-6">
                <WeeklyTempTrendChart forecasts={weeklyForecast.data} />
              </View>
            )}

            <Text className="mb-2 mt-6 text-sm font-medium text-[#94b4d4]">주간 예보</Text>
            {weeklyForecast.isLoading && (
              <Text className="text-sm text-[#6b7fa3]">불러오는 중...</Text>
            )}
            {!weeklyForecast.isLoading && weeklyForecast.error && (
              <Text className="text-sm text-red-400">예보 정보를 불러오지 못했습니다</Text>
            )}
          </View>
        }
        renderItem={({ item }) => <ForecastRow forecast={item} />}
      />
    </View>
  );
}
