# 날씨 앱 (0100DEV 프론트엔드 과제)

Open-Meteo API로 여러 도시의 날씨를 조회하고, 관심 도시를 즐겨찾기로
저장하는 React Native(Expo) 앱입니다.

## 1. 선택한 플랫폼과 실행 방법

- **플랫폼**: React Native (Expo, expo-router) — iOS / Android / Web 동시 지원
- **주요 라이브러리**: TypeScript, Zustand(+AsyncStorage persist), NativeWind(Tailwind), react-native-svg

### 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run start      # Expo 개발 서버 (Metro, 기본 포트 8081)
npm run ios        # iOS 시뮬레이터
npm run android    # Android 에뮬레이터
npm run web        # 웹 브라우저
```

`npm run start` 실행 후 터미널에 뜨는 QR코드를 Expo Go 앱으로 스캔해도 확인할 수 있습니다.

### 📦 실행 가능한 APK

소스 실행 없이 바로 설치해서 확인하실 수 있습니다.

**[weather-app.apk 다운로드](https://github.com/foiirlo/weather-app/releases/tag/v1.0.0)**


## 2. 폴더 구조 및 설계 의도

```
app/            # expo-router 화면 (라우팅 전용, 로직 최소화)
src/
  api/          # 순수 fetch 함수. UI/상태를 모르는 데이터 레이어
  hooks/        # api 호출 + loading/error/data 캡슐화
  store/        # Zustand. 서버 데이터는 넣지 않고 즐겨찾기 등 클라이언트 상태만 관리
  components/   # 프레젠테이션 전용. props로만 데이터를 받아 렌더링
  constants/    # 도시 좌표, weather_code 매핑 등 정적 데이터
  types/        # API 응답 및 도메인 타입
  utils/        # 포맷터 등 순수 함수
```

레이어를 분리한 이유는 관심사를 명확히 나누기 위해서입니다.

- **api**: fetch와 응답 파싱만 담당하고 React를 전혀 모릅니다. 테스트/교체가 쉽습니다.
- **hooks**: api를 호출해 loading/error/data 상태로 감싸는 역할만 하고, 컴포넌트에는
  이미 가공된 상태만 넘깁니다. react-query 없이도 화면 코드에서 fetch 로직이 드러나지 않습니다.
- **store**: 서버에서 온 날씨 데이터는 절대 넣지 않고, 즐겨찾기 도시 id 목록처럼
  클라이언트에서만 존재하는 상태만 관리합니다. 날씨 데이터와 클라이언트 상태를
  같은 저장소에서 섞지 않기 위한 의도적인 제약입니다.
- **components**: props로만 데이터를 받는 프레젠테이션 전용 컴포넌트입니다.
  fetch나 상태 로직이 없어 재사용과 테스트가 쉽습니다.

## 3. 전체 기능

- **도시 목록** — 등록된 5개 도시(서울/부산/인천/대구/청주)의 현재 날씨를 카드로 표시
- **검색 / 즐겨찾기 필터** — 도시 이름 검색, 전체/즐겨찾기 탭 전환
- **즐겨찾기 저장** — 도시별 즐겨찾기 토글, AsyncStorage로 영구 저장(재실행해도 유지)
- **날씨 지도** — 도시별 현재 기온을 색상(파랑→주황)으로 표시하는 SVG 지도, 즐겨찾기 도시는 테두리로 강조, 지도에서 도시를 탭하면 상세 화면으로 이동
- **도시 상세** — 현재 날씨(기온/체감온도/습도/풍속/날씨 상태), 7일 주간 예보 리스트,
  주간 최고/최저 기온 추이 미니 차트
- **반응형 웹 레이아웃** — 웹에서는 콘텐츠 폭을 제한해 중앙 정렬, 스크롤바 숨김 처리
<p float="left">
  <img src="https://github.com/user-attachments/assets/4b32d909-d011-498e-8e5e-d1bd9311e265" width="150" />
  <img src="https://github.com/user-attachments/assets/edddae37-a3a3-4e50-94be-45f2048115d0" width="150" />
  <img src="https://github.com/user-attachments/assets/878958e4-aa64-49d8-ad13-1fc6bd37ce49" width="150" />
  <img src="https://github.com/user-attachments/assets/41ce3fc3-4454-4379-95da-e0594a93b9f8" width="150" />
  <img src="https://github.com/user-attachments/assets/ac9de358-ba53-4e78-85ec-0f5e7c915fc6" width="150" />
</p>


## 4. AI 도구 사용 여부

Claude Code를 사용했습니다. API 연동, 훅/스토어 구조화, 컴포넌트 스타일링,
레이아웃 조정 등 구현 전반에 걸쳐 활용했고, CLAUDE.md에 폴더 구조·레이어 분리
원칙·디자인 토큰을 명시해 그 규칙을 따르도록 했습니다.
