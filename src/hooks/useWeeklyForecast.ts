import { useEffect, useState } from 'react';

import { fetchWeeklyForecast } from '@/src/api/openMeteo';
import type { DailyForecast } from '@/src/types/weather';

type UseWeeklyForecastResult = {
  data: DailyForecast[] | null;
  isLoading: boolean;
  error: Error | null;
};

// 언마운트-재마운트마다 로딩 스피너가 뜨는 걸 막기 위한 좌표별 메모리 캐시.
// 캐시가 있으면 재마운트 시 즉시 보여주고 조용히 갱신만 함.
const cache = new Map<string, DailyForecast[]>();

// api 호출 + loading/error/data 캡슐화. 컴포넌트는 이 훅의 반환값만 사용.
export function useWeeklyForecast(latitude: number, longitude: number): UseWeeklyForecastResult {
  const cacheKey = `${latitude},${longitude}`;
  const [data, setData] = useState<DailyForecast[] | null>(() => cache.get(cacheKey) ?? null);
  const [isLoading, setIsLoading] = useState(() => !cache.has(cacheKey));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!cache.has(cacheKey)) setIsLoading(true);
    setError(null);

    fetchWeeklyForecast(latitude, longitude)
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
