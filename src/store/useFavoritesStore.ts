import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type FavoritesState = {
  favoriteCityIds: string[];
  toggleFavorite: (cityId: string) => void;
  isFavorite: (cityId: string) => boolean;
};

// 서버 날씨 데이터는 절대 넣지 않음. 즐겨찾기 도시 id 목록 등
// 클라이언트에서만 관리하는 상태 전용 store.
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteCityIds: [],
      toggleFavorite: (cityId) =>
        set((state) => ({
          favoriteCityIds: state.favoriteCityIds.includes(cityId)
            ? state.favoriteCityIds.filter((id) => id !== cityId)
            : [...state.favoriteCityIds, cityId],
        })),
      isFavorite: (cityId) => get().favoriteCityIds.includes(cityId),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
