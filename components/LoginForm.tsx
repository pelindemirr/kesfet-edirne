import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginForm({
  onLogin,
}: {
  onLogin?: (email: string, password: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>Hoş Geldiniz</ThemedText>
      <ThemedText style={styles.subtitle}>Hesabınıza giriş yapın</ThemedText>

      <ThemedText style={styles.label}>E-posta</ThemedText>
      <View style={styles.inputBox}>
        <IconSymbol name="envelope" size={20} color="#bbb" style={styles.icon} />
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
      <View style={styles.inputBox}>
        <IconSymbol name="lock" size={20} color="#bbb" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#bbb"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
          <IconSymbol
            name={showPassword ? 'eye.slash' : 'eye'}
            size={20}
            color="#bbb"
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgot}>
        <ThemedText style={styles.forgotText}>Şifremi unuttum</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onLogin?.(email, password)}
      >
        <ThemedText style={styles.buttonText}>Giriş Yap</ThemedText>
      </TouchableOpacity>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>Hesabınız yok mu? </ThemedText>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <ThemedText style={styles.register}>Kayıt olun</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 36,
    width: '98%',
    maxWidth: 340,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    color: '#b91c1c',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 10,
  },
  label: {
    color: '#111827',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 12,
    color: '#111827',
  },
  icon: {
    marginLeft: 8,
  },
  iconRight: {
    marginRight: 8,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  forgotText: {
    color: '#b91c1c',
    fontSize: 11,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#b91c1c',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 11,
  },
  register: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontSize: 11,
  },
});