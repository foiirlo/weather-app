import { Ionicons } from '@expo/vector-icons';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// react-navigation의 `header` 옵션에 그대로 꽂아 쓰는 커스텀 헤더.
// 네이티브 기본 헤더(플랫폼마다 타이틀 정렬/백버튼 아이콘/보더 렌더링이 다름)에
// 의존하지 않아, 웹에서 보이는 것과 동일한 스타일이 iOS/Android에서도 나옴.
export function ScreenHeader({ navigation, options, back }: NativeStackHeaderProps) {
  return (
    <SafeAreaView edges={['top']} className="border-b border-[#1e2d4a] bg-[#0e1629]">
      <View className="h-14 flex-row items-center px-2">
        {back && (
          <Pressable onPress={navigation.goBack} hitSlop={8} className="p-2">
            <Ionicons name="chevron-back" size={26} color="#e8edf8" />
          </Pressable>
        )}
        <Text className="ml-1 text-lg font-semibold text-[#e8edf8]">{options.title}</Text>
      </View>
    </SafeAreaView>
  );
}
