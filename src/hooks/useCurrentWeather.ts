import { useEffect, useState } from 'react';

import { fetchCurrentWeather } from '@/src/api/openMeteo';
import type { CurrentWeather } from '@/src/types/weather';

type UseCurrentWeatherResult = {
  data: CurrentWeather | null;
  isLoading: boolean;
  error: Error | null;
};

// 도시 목록에서 검색/필터링으로 카드가 언마운트-재마운트될 때마다
// 매번 로딩 스피너가 뜨는 걸 막기 위한 좌표별 메모리 캐시.
// 캐시가 있으면 재마운트 시 즉시 보여주고 조용히 갱신만 함.
const cache = new Map<string, CurrentWeather>();

// api 호출 + loading/error/data 캡슐화. 컴포넌트는 이 훅의 반환값만 사용.
export function useCurrentWeather(latitude: number, longitude: number): UseCurrentWeatherResult {
  const cacheKey = `${latitude},${longitude}`;
  const [data, setData] = useState<CurrentWeather | null>(() => cache.get(cacheKey) ?? null);
  const [isLoading, setIsLoading] = useState(() => !cache.has(cacheKey));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!cache.has(cacheKey)) setIsLoading(true);
    setError(null);

    fetchCurrentWeather(latitude, longitude)
      .then((result) => {
        cache.set(cacheKey, result);
        if (!isCancelled) setData(result);
      })
      .catch((err) => {
        if (!isCancelled) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [latitude, longitude, cacheKey]);

  return { data, isLoading, error };
}
