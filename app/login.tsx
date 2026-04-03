import LoginFormTW from '@/components/LoginFormTW';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Keşfi Edirne</ThemedText>
      <ThemedText style={styles.subtitle}>
        Tarihi keşfedin, rotanızı planlayın
      </ThemedText>

      <TouchableOpacity style={styles.backButton} onPress={() => {}}>
        <IconSymbol name="arrow.left" size={18} color="#d32f2f" />
        <ThemedText style={styles.backText}>Ana Sayfaya Dön</ThemedText>
      </TouchableOpacity>

      <LoginFormTW />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 48,
    alignItems: 'center',
  },
  title: {
    color: '#b91c1c',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backText: {
    color: '#1d4ed8',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: 'bold',
  },
});