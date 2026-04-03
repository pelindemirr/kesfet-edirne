import RegisterForm from '@/components/RegisterForm';
import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function RegisterScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Keşfi Edirne</ThemedText>
      <View style={{ marginBottom: 8 }}>
        <ThemedText style={{ color: '#1976d2', fontWeight: 'bold', textAlign: 'center', fontSize: 15 }} onPress={() => navigation?.navigate ? navigation.navigate('index') : null}>
          Ana Sayfaya Dön
        </ThemedText>
      </View>
      <ThemedText style={styles.subtitle}>Tarihi keşfedin, rotanızı planlayın</ThemedText>
      <RegisterForm onRegister={() => { /* Kayıt işlemi */ }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 48,
    alignItems: 'center',
  },
  title: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 2,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    marginBottom: 16,
  },
});
