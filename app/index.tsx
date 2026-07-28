import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CityListItem } from '@/src/components/CityListItem';
import { WeatherMap } from '@/src/components/WeatherMap';
import { CITIES } from '@/src/constants/cities';
import { useAllCitiesWeather } from '@/src/hooks/useAllCitiesWeather';
import { useFavoritesStore } from '@/src/store/useFavoritesStore';

// 도시 목록 화면. 로직은 hooks/store에 위임하고 라우팅/레이아웃만 담당.
export default function CityListScreen() {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const favoriteCityIds = useFavoritesStore((state) => state.favoriteCityIds);
  const weatherByCity = useAllCitiesWeather();

  // 지도 모달이 열린 채로 도시 상세로 이동하면 모달(네이티브 오버레이)이
  // 새 화면 위에 그대로 남아있게 되므로, 화면 이탈 시 강제로 닫아줌.
  useFocusEffect(
    useCallback(() => {
      return () => setShowMap(false);
    }, [])
  );

  const cities = CITIES.filter((city) => {
    const matchesFavorite = !showFavoritesOnly || favoriteCityIds.includes(city.id);
    const matchesSearch = city.name.includes(searchQuery.trim());
    return matchesFavorite && matchesSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#080d1a]">
      <FlatList
        data={cities}
        keyExtractor={(city) => city.id}
        contentContainerClassName="gap-3 p-4"
        ListHeaderComponent={
          <View className="mb-2 gap-4">
            <View>
              <Text className="text-3xl font-bold text-[#e8edf8]">날씨 현황</Text>
              <Text className="mt-1 text-sm text-[#94b4d4]">
                도시를 선택하면 주간 예보를 확인할 수 있습니다
              </Text>
            </View>

            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setShowFavoritesOnly(false)}
                className="flex-row items-center gap-1.5 rounded-full border px-4 py-2"
                style={{ borderColor: !showFavoritesOnly ? '#38bdf8' : '#1e2d4a' }}
              >
                <Ionicons
                  name="grid-outline"
                  size={16}
                  color={!showFavoritesOnly ? '#38bdf8' : '#94b4d4'}
                />
                <Text style={{ color: !showFavoritesOnly ? '#38bdf8' : '#94b4d4' }}>전체</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowFavoritesOnly(true)}
                className="flex-row items-center gap-1.5 rounded-full border px-4 py-2"
                style={{ borderColor: showFavoritesOnly ? '#38bdf8' : '#1e2d4a' }}
              >
                <Ionicons
                  name={showFavoritesOnly ? 'star' : 'star-outline'}
                  size={16}
                  color={showFavoritesOnly ? '#38bdf8' : '#94b4d4'}
                />
                <Text style={{ color: showFavoritesOnly ? '#38bdf8' : '#94b4d4' }}>즐겨찾기</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowMap(true)}
                className="flex-row items-center gap-1.5 rounded-full border px-4 py-2"
                style={{ borderColor: '#1e2d4a' }}
              >
                <Ionicons name="map-outline" size={16} color="#94b4d4" />
                <Text style={{ color: '#94b4d4' }}>지도</Text>
              </Pressable>
            </View>

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="도시 검색"
              placeholderTextColor="#6b7fa3"
              className="rounded-2xl border border-[#1e2d4a] bg-[#0e1629] px-4 py-3 text-[#e8edf8]"
            />

            <View className="h-px bg-[#1e2d4a]" />
          </View>
        }
        ListEmptyComponent={
          <Text className="text-center text-[#6b7fa3]">
            {searchQuery.trim()
              ? '검색 결과가 없습니다'
              : '즐겨찾기한 도시가 없습니다'}
          </Text>
        }
        renderItem={({ item }) => (
          <CityListItem city={item} onPress={() => router.push(`/city/${item.id}`)} />
        )}
      />

      <Modal
        visible={showMap}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMap(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/70 p-6">
          <View className="rounded-2xl border border-[#1e2d4a] bg-[#0e1629] p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Pressable onPress={() => setShowMap(false)} hitSlop={8}>
                <Ionicons name="close" size={24} color="#94b4d4" />
              </Pressable>
            </View>
            <WeatherMap weatherByCity={weatherByCity} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
