import { CityCard } from '@/src/components/CityCard';
import { useCurrentWeather } from '@/src/hooks/useCurrentWeather';
import { useFavoritesStore } from '@/src/store/useFavoritesStore';
import type { City } from '@/src/types/weather';

type CityListItemProps = {
  city: City;
  onPress: () => void;
};

// 목록에서 도시별로 개별 훅 호출이 필요해(rules of hooks) 존재하는 연결 컴포넌트.
// 실제 렌더링은 순수 프레젠테이션 컴포넌트인 CityCard에 위임.
export function CityListItem({ city, onPress }: CityListItemProps) {
  const { data, isLoading, error } = useCurrentWeather(city.latitude, city.longitude);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(city.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <CityCard
      cityName={city.name}
      weather={data}
      isLoading={isLoading}
      error={error}
      isFavorite={isFavorite}
      onToggleFavorite={() => toggleFavorite(city.id)}
      onPress={onPress}
    />
  );
}
