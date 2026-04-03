import { ThemedText } from '@/components/themed-text';
import { View } from 'react-native';

export default function MenuScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText>Menü Sayfası</ThemedText>
    </View>
  );
}
