import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";

// 아이콘 폰트(Ionicons)가 로드되기 전에 헤더가 그려지면 폴백 글리프가
// 잠깐 보였다가 실제 아이콘으로 바뀌는 깜빡임이 생김 → 로드 전까지 스플래시 유지.
SplashScreen.preventAutoHideAsync();

// 이 앱은 시스템 설정과 무관하게 항상 고정된 다크 팔레트를 사용 (CLAUDE.md 색상 토큰 참고).
const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#080d1a',
    card: '#0e1629',
    border: '#1e2d4a',
    text: '#e8edf8',
    primary: '#38bdf8',
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={AppTheme}>
        <View style={{ flex: 1, backgroundColor: '#080d1a' }}>
          <View
            style={
              Platform.OS === 'web'
                ? { flex: 1, width: '60%', maxWidth: '60%', alignSelf: 'center' }
                : { flex: 1 }
            }
          >
            <Stack
              screenOptions={{
                header: (props) => <ScreenHeader {...props} />,
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="city/[id]" options={{ title: '' }} />
            </Stack>
          </View>
        </View>
        <StatusBar style="light" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
