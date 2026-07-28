import { Text, View } from 'react-native';
import Svg, { Circle, Polyline, Text as SvgText } from 'react-native-svg';

import type { DailyForecast } from '@/src/types/weather';
import { formatDayLabel, formatTemperature } from '@/src/utils/format';

type WeeklyTempTrendChartProps = {
  forecasts: DailyForecast[];
};

const CHART_WIDTH = 300;
const LINE_AREA_HEIGHT = 64;
const LABEL_AREA_HEIGHT = 18;
const CHART_HEIGHT = LINE_AREA_HEIGHT + LABEL_AREA_HEIGHT;
const PADDING_Y = 10;
const LABEL_MARGIN_X = 12;
const MAX_COLOR = '#38bdf8';
const MIN_COLOR = '#94b4d4';

// 프레젠테이션 전용. 7일 최고/최저 기온 추이를 아주 작은 라인 차트로 보여줌.
// 색상만으로 두 계열을 구분하지 않도록 범례에 값까지 같이 표시.
// 요일 라벨은 점과 같은 SVG 좌표계에서 그려서 그래프 간격과 정확히 맞춤.
export function WeeklyTempTrendChart({ forecasts }: WeeklyTempTrendChartProps) {
  if (forecasts.length < 2) return null;

  const allTemps = forecasts.flatMap((f) => [f.temperatureMax, f.temperatureMin]);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const range = maxTemp - minTemp || 1;

  const plotWidth = CHART_WIDTH - LABEL_MARGIN_X * 2;
  const xStep = plotWidth / (forecasts.length - 1);
  const toX = (i: number) => LABEL_MARGIN_X + i * xStep;
  const toY = (temp: number) =>
    LINE_AREA_HEIGHT - PADDING_Y - ((temp - minTemp) / range) * (LINE_AREA_HEIGHT - PADDING_Y * 2);

  const maxPoints = forecasts.map((f, i) => [toX(i), toY(f.temperatureMax)] as const);
  const minPoints = forecasts.map((f, i) => [toX(i), toY(f.temperatureMin)] as const);

  const toPointsString = (points: readonly (readonly [number, number])[]) =>
    points.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <View className="rounded-2xl border border-[#1e2d4a] bg-[#0e1629] p-4">
      <View className="mb-3 flex-row items-center gap-4">
        <View className="flex-row items-center gap-1.5">
          <View className="h-2 w-2 rounded-full" style={{ backgroundColor: MAX_COLOR }} />
          <Text className="text-xs text-[#94b4d4]">최고 {formatTemperature(maxTemp)}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="h-2 w-2 rounded-full" style={{ backgroundColor: MIN_COLOR }} />
          <Text className="text-xs text-[#94b4d4]">최저 {formatTemperature(minTemp)}</Text>
        </View>
      </View>

      <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
        <Polyline
          points={toPointsString(maxPoints)}
          fill="none"
          stroke={MAX_COLOR}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Polyline
          points={toPointsString(minPoints)}
          fill="none"
          stroke={MIN_COLOR}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {maxPoints.map(([x, y], i) => (
          <Circle key={`max-${i}`} cx={x} cy={y} r={3} fill={MAX_COLOR} />
        ))}
        {minPoints.map(([x, y], i) => (
          <Circle key={`min-${i}`} cx={x} cy={y} r={3} fill={MIN_COLOR} />
        ))}
        {forecasts.map((f, i) => (
          <SvgText
            key={f.date}
            x={toX(i)}
            y={LINE_AREA_HEIGHT + LABEL_AREA_HEIGHT - 5}
            fontSize={10}
            fill="#6b7fa3"
            textAnchor="middle"
          >
            {formatDayLabel(f.date)}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
