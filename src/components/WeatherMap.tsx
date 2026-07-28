import { router } from 'expo-router';
import { Fragment, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';

import { CITIES } from '@/src/constants/cities';
import { useFavoritesStore } from '@/src/store/useFavoritesStore';
import type { CurrentWeather } from '@/src/types/weather';

const VIEW_WIDTH = 330;
const VIEW_HEIGHT = 350;
const PADDING = 10;

// 한국 대략적인 위경도 범위 (5개 도시 기준으로 여유있게 설정)
const LAT_MIN = 34.5;
const LAT_MAX = 38.2;
const LON_MIN = 126.3;
const LON_MAX = 129.5;

function latLonToXY(lat: number, lon: number) {
  const x = PADDING + ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * (VIEW_WIDTH - PADDING * 2);
  // 위도는 북쪽(큰 값)이 위로 가야 하므로 반전
  const y = PADDING + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (VIEW_HEIGHT - PADDING * 2);
  return { x, y };
}

// 온도에 따라 점 색상을 파랑(차가움)~빨강(더움)으로 보간
function temperatureToColor(temp: number) {
  const MIN_T = 15;
  const MAX_T = 35;
  const ratio = Math.max(0, Math.min(1, (temp - MIN_T) / (MAX_T - MIN_T)));

  // #38bdf8 (하늘색, 차가움) -> #f97316 (주황, 더움) 보간
  const cold = { r: 0x38, g: 0xbd, b: 0xf8 };
  const hot = { r: 0xf9, g: 0x73, b: 0x16 };

  const r = Math.round(cold.r + (hot.r - cold.r) * ratio);
  const g = Math.round(cold.g + (hot.g - cold.g) * ratio);
  const b = Math.round(cold.b + (hot.b - cold.b) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
}

type WeatherMapProps = {
  weatherByCity: Record<string, CurrentWeather | null>;
};

// 프레젠테이션 전용. props로 받은 도시별 날씨를 지도 위 점으로 시각화만 함.
export function WeatherMap({ weatherByCity }: WeatherMapProps) {
  const favoriteCityIds = useFavoritesStore((state) => state.favoriteCityIds);

  const points = useMemo(
    () =>
      CITIES.map((city) => {
        const { x, y } = latLonToXY(city.latitude, city.longitude);
        const weather = weatherByCity[city.id] ?? null;
        return { city, x, y, weather };
      }),
    [weatherByCity]
  );

  return (
    <View className="items-center">
      {/* Svg와 터치 레이어가 같은 좌표계를 쓰도록 고정 크기 박스로 함께 묶음.
          바깥의 items-center가 이 박스 전체를 가운데 정렬해도 내부 정렬은 안 틀어짐. */}
      <View style={{ width: VIEW_WIDTH, height: VIEW_HEIGHT }}>
        <Svg width={VIEW_WIDTH} height={VIEW_HEIGHT}>
          {/* 지도 영역을 나타내는 스타일화된 배경 (실제 해안선이 아님을 의도적으로 단순화) */}
          <Rect
            x={PADDING / 2}
            y={PADDING / 2}
            width={VIEW_WIDTH - PADDING}
            height={VIEW_HEIGHT - PADDING}
            rx={24}
            fill="#080d1a"
            stroke="#1e2d4a"
            strokeWidth={1}
            strokeDasharray="4,4"
          />

          {points.map(({ city, x, y, weather }) => {
            const color = weather ? temperatureToColor(weather.temperature) : '#6b7fa3';
            const isFavorite = favoriteCityIds.includes(city.id);

            return (
              <Fragment key={city.id}>
                {/* 즐겨찾기 도시는 바깥 링으로 강조 */}
                {isFavorite && (
                  <Circle cx={x} cy={y} r={12} fill="none" stroke="#fbbf24" strokeWidth={1.5} />
                )}
                <Circle cx={x} cy={y} r={8} fill={color} />
                <SvgText
                  x={x}
                  y={y - 16}
                  fontSize={13}
                  fontWeight="600"
                  fill="#e8edf8"
                  textAnchor="middle"
                >
                  {city.name}
                </SvgText>
                {weather && (
                  <SvgText x={x} y={y + 24} fontSize={11} fill="#94b4d4" textAnchor="middle">
                    {Math.round(weather.temperature)}°
                  </SvgText>
                )}
              </Fragment>
            );
          })}
        </Svg>

        {/* SVG 위에 투명 터치 영역을 얹어 탭 이벤트 처리 (Svg 내부 onPress 이슈 우회) */}
        <View className="absolute inset-0">
          {points.map(({ city, x, y }) => (
            <Pressable
              key={city.id}
              onPress={() => router.push(`/city/${city.id}`)}
              style={{
                position: 'absolute',
                left: x - 24,
                top: y - 24,
                width: 48,
                height: 48,
                borderRadius: 24,
              }}
            />
          ))}
        </View>
      </View>

      <View className="gap-1 mt-3" style={{ width: VIEW_WIDTH }}>
        <Text className="text-xs text-[#6b7fa3]">
          ‣ 원 색상은 현재 기온을 나타냅니다 (파랑: 선선함 → 주황: 더움)
        </Text>
        <Text className="text-xs text-[#6b7fa3]">‣ 노란 테두리는 즐겨찾기한 도시입니다</Text>
      </View>
    </View>
  );
}
