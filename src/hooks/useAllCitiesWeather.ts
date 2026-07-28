import { CITIES } from '@/src/constants/cities';
import type { CurrentWeather } from '@/src/types/weather';

import { useCurrentWeather } from './useCurrentWeather';

// 도시가 5개로 고정이라 반복문 대신 개별 호출 (rules of hooks 준수).
// CITIES 개수가 바뀌면 이 훅도 같이 늘려야 함.
export function useAllCitiesWeather(): Record<string, CurrentWeather | null> {
  const city0 = useCurrentWeather(CITIES[0].latitude, CITIES[0].longitude);
  const city1 = useCurrentWeather(CITIES[1].latitude, CITIES[1].longitude);
  const city2 = useCurrentWeather(CITIES[2].latitude, CITIES[2].longitude);
  const city3 = useCurrentWeather(CITIES[3].latitude, CITIES[3].longitude);
  const city4 = useCurrentWeather(CITIES[4].latitude, CITIES[4].longitude);

  return {
    [CITIES[0].id]: city0.data,
    [CITIES[1].id]: city1.data,
    [CITIES[2].id]: city2.data,
    [CITIES[3].id]: city3.data,
    [CITIES[4].id]: city4.data,
  };
}
