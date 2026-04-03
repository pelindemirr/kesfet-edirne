import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterForm({ onRegister }: { onRegister?: (name: string, email: string, password: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.formBox}>
      <ThemedText style={styles.title}>Hesap Oluşturun</ThemedText>
      <ThemedText style={styles.subtitle}>Yeni bir hesap oluşturun</ThemedText>
      <ThemedText style={styles.label}>Ad Soyad</ThemedText>
      <View style={styles.inputRow}>
        <IconSymbol name="paperplane.fill" size={20} color="#bbb" style={{marginLeft:8}} />
        <TextInput
          style={styles.input}
          placeholder="Ad Soyad"
          placeholderTextColor="#bbb"
          value={name}
          onChangeText={setName}
        />
      </View>
      <ThemedText style={styles.label}>E-posta</ThemedText>
      <View style={styles.inputRow}>
        <IconSymbol name="envelope" size={20} color="#bbb" style={{marginLeft:8}} />
        <TextInput
          style={styles.input}
          placeholder="ornek@email.com"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <ThemedText style={styles.label}>Şifre</ThemedText>
      <View style={styles.inputRow}>
        <IconSymbol name="lock" size={20} color="#bbb" style={{marginLeft:8}} />
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#bbb"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
          <IconSymbol name={showPassword ? 'eye.slash' : 'eye'} size={20} color="#bbb" style={{marginRight:8}} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.registerBtn} onPress={() => onRegister?.(name, email, password)}>
        <ThemedText style={styles.registerBtnText}>Hesap Oluştur</ThemedText>
      </TouchableOpacity>
      <View style={styles.bottomRow}>
        <ThemedText style={styles.bottomText}>Hesabınız var mı? </ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.loginText}>Giriş yapın</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 26,
    marginHorizontal: 0,
    marginTop: 36,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 3,
    width: '98%',
    alignSelf: 'center',
    maxWidth: 340,
  },
  title: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
  },
  subtitle: {
    color: '#888',
    fontSize: 13,
    marginBottom: 12,
  },
  label: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#222',
    backgroundColor: 'transparent',
  },
  registerBtn: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  registerBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    color: '#222',
    fontSize: 15,
  },
  loginText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 2,
  },
});
