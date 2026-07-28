@AGENTS.md

# 프로젝트 컨텍스트

0100DEV 프론트엔드 채용 과제입니다.
Open-Meteo API를 활용해 여러 도시의 날씨를 조회하고, 관심 도시를
즐겨찾기로 저장하는 앱을 만듭니다.

- 플랫폼: React Native (Expo, expo-router)
- 마감: 2026-07-29 자정

---

## 기술 스택

- TypeScript
- 상태관리: Zustand (+ AsyncStorage persist, 즐겨찾기 저장용)
- 서버 데이터: 커스텀 훅 (src/hooks) — react-query는 사용하지 않음
- 스타일링: NativeWind (Tailwind CSS 문법을 React Native 환경에서
  사용할 수 있게 해주는 라이브러리, className 방식)
- 라우팅: expo-router

---

## 폴더 구조 및 레이어 분리 원칙

이 구조를 반드시 지켜서 코드를 생성/수정할 것:

app/ # expo-router 화면 (라우팅 전용, 로직 최소화)
src/
api/ # 순수 fetch 함수. UI/상태 모르는 순수 데이터 레이어
hooks/ # api 호출 + loading/error/data 캡슐화
store/ # Zustand. 서버 데이터 X, 클라이언트 상태(즐겨찾기 등)만
components/ # 프레젠테이션 전용. props로만 데이터 받음
constants/ # 도시 좌표, weather_code 매핑 등 정적 데이터
types/ # API 응답 및 도메인 타입
utils/ # 포맷터 등 순수 함수


- **컴포넌트에 직접 fetch나 상태 로직을 넣지 말 것.** 항상 hooks를 통해
  가져온 데이터를 props로 받아 렌더링만 하도록 작성.
- **store에는 서버에서 온 날씨 데이터를 넣지 말 것.** store는 즐겨찾기
  ID 목록처럼 클라이언트에서만 관리하는 상태 전용.
- 새 화면/기능 추가 시에도 이 레이어 구분을 유지해줘.

---

## 디자인 토큰

색상/폰트는 아래 값을 정확히 사용할 것. 임의로 추정하거나 바꾸지 말 것.
화면별 레이아웃 지시는 작업 요청 시 별도로 전달함.

### 색상
- 배경(bg): #080d1a
- 카드 배경(card): #0e1629 → #111827 (좌상단→우하단 그라데이션)
- 카드 보더(border): #1e2d4a / hover 시 #2a3f5e
- 기본 텍스트(text): #e8edf8
- 보조 텍스트(sub): #94b4d4
- 흐린 텍스트(muted): #6b7fa3
- 포인트 색상(primary): #38bdf8 (하늘색)
- 강조 색상(accent/gold): #fbbf24 (즐겨찾기 배지, 맑음 날씨 라벨 등 포인트 강조용)
- 에러: red-400 계열

### 폰트
- 기본 폰트: Outfit (weight 300/400/500/600/700)
- 숫자·온도 표시 전용: JetBrains Mono (weight 400/500/600)
  → expo-google-fonts로 로드 (@expo-google-fonts/outfit,
    @expo-google-fonts/jetbrains-mono)

### 공통 톤
- 전체적으로 여백 넉넉하게, 둥근 모서리(rounded-2xl 수준) 선호
- 숫자(온도, 습도 등)는 항상 mono 폰트로 표시
- 텍스트 계층 구분 뚜렷하게 (진한 텍스트 vs 흐린 텍스트)
- 카드/버튼 누름 상태: 살짝 진해지거나 떠오르는 효과 (Pressable 활용)
