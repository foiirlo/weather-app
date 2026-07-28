import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

type FavoriteBadgeProps = {
  isFavorite: boolean;
  onPress: () => void;
};

// 프레젠테이션 전용. 도시 카드용 사각 배지 스타일 즐겨찾기 토글.
export function FavoriteBadge({ isFavorite, onPress }: FavoriteBadgeProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="h-8 w-8 items-center justify-center rounded-lg border"
      style={
        isFavorite
          ? { backgroundColor: 'rgba(251,191,36,0.15)', borderColor: '#fbbf24' }
          : { borderColor: '#1e2d4a' }
      }
    >
      <Ionicons
        name={isFavorite ? 'star' : 'star-outline'}
        size={12}
        color={isFavorite ? '#fbbf24' : '#6b7fa3'}
      />
    </Pressable>
  );
}
