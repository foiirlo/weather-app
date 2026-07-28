import type { City } from '@/src/types/weather';

// 도시 좌표 목록 (Open-Meteo 조회용). 필요 시 추가/수정.
export const CITIES: City[] = [
  { id: 'seoul', name: '서울', latitude: 37.5665, longitude: 126.978 },
  { id: 'busan', name: '부산', latitude: 35.1796, longitude: 129.0756 },
  { id: 'incheon', name: '인천', latitude: 37.4563, longitude: 126.7052 },
  { id: 'daegu', name: '대구', latitude: 35.8714, longitude: 128.6014 },
  { id: 'cheongju', name: '청주', latitude: 36.6424, longitude: 127.489 },
];
