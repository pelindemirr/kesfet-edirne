import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterForm({
  onRegister,
  errorMessage,
  isSubmitting = false,
}: {
  onRegister?: (name: string, email: string, password: string) => void;
  errorMessage?: string | null;
  isSubmitting?: boolean;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [kvkkChecked, setKvkkChecked] = useState(false); 
  const [kvkkModalVisible, setKvkkModalVisible] = useState(false); 
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  const displayedError = localError ?? errorMessage ?? null;

  return (
    // ↕️ SAYFA KAYMA SORUNUNU ÇÖZEN DIŞ SCROLLVIEW KATMANI
    <ScrollView 
      className="w-full"
      contentContainerStyle={{ paddingVertical: 16, alignItems: 'center' }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View
        className="w-[90%] max-w-[380px] rounded-[16px] border border-[#e5e7eb] bg-white px-6 py-6 shadow-lg shadow-black/10"
      >
        <ThemedText className="mb-1 text-[33px] font-bold leading-[38px] text-[#e30613]">Hesap Oluşturun</ThemedText>
        <ThemedText className="mb-5 text-[22px] text-[#4b5563]">Yeni bir hesap oluşturun</ThemedText>

        <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">Ad Soyad</ThemedText>
        <View className="mb-3 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
          <IconSymbol name="person" size={16} color="#6b7280" />
          <TextInput
            className="ml-2 flex-1 text-[13px] text-[#111827]"
            placeholder="Ad Soyad"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
          />
        </View>

        <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">E-posta</ThemedText>
        <View className="mb-3 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
          <IconSymbol name="envelope" size={16} color="#6b7280" />
          <TextInput
            className="ml-2 flex-1 text-[13px] text-[#111827]"
            placeholder="Mail adresinizi"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">Şifre</ThemedText>
        <View className="mb-4 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
          <IconSymbol name="lock" size={16} color="#6b7280" />
          <TextInput
            className="ml-2 flex-1 text-[13px] text-[#111827]"
            placeholder="Şifrenizi giriniz"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
            <IconSymbol
              name={showPassword ? 'eye.slash' : 'eye'}
              size={16}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>

        <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">Şifre Tekrar</ThemedText>
        <View className="mb-4 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
          <IconSymbol name="lock" size={16} color="#6b7280" />
          <TextInput
            className="ml-2 flex-1 text-[13px] text-[#111827]"
            placeholder="Şifrenizi tekrar giriniz"
            placeholderTextColor="#9ca3af"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
            <IconSymbol
              name={showPassword ? 'eye.slash' : 'eye'}
              size={16}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>

      

       {/* 🔐 KVKK ONAY CHECKBOX SATIRI */}
<View className="mb-4 flex-row items-start gap-2 pr-2">
  <TouchableOpacity 
    onPress={() => setKvkkChecked(v => !v)}
    className={`mt-0.5 h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border ${
      kvkkChecked ? 'border-[#e30613] bg-[#e30613]' : 'border-[#d1d5db] bg-white'
    }`}
    activeOpacity={0.8}
  >
    {/* Eski küçük kutu yerine gerçek Check ikonu ekledik */}
    {kvkkChecked && (
      <IconSymbol name="checkmark" size={12} color="#ffffff" /> 
      // Not: Eğer 'checkmark' ikon ismini kabul etmezse 'check' veya 'checkmark.png' gibi projenizdeki mevcut bir onay ikon adını yazabilirsiniz.
    )}
  </TouchableOpacity>

  <View className="flex-1 flex-row flex-wrap items-center">
    <TouchableOpacity onPress={() => setKvkkChecked(v => !v)} activeOpacity={1}>
      <ThemedText className="text-[12px] leading-[16px] text-[#4b5563]">
        Kullanıcı sözleşmesini ve{' '}
      </ThemedText>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setKvkkModalVisible(true)}>
      <ThemedText className="text-[12px] leading-[16px] font-bold text-[#e30613] underline">
        KVKK Aydınlatma Metni'ni
      </ThemedText>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setKvkkChecked(v => !v)} activeOpacity={1}>
      <ThemedText className="text-[12px] leading-[16px] text-[#4b5563]">
        {' '}okudum, onaylıyorum.
      </ThemedText>
    </TouchableOpacity>
  </View>
</View>

        {displayedError ? (
          <View className="mb-4 rounded-[8px] bg-[#fef2f2] px-3 py-2">
            <ThemedText className="text-[12px] font-medium text-[#b91c1c]">{displayedError}</ThemedText>
          </View>
        ) : null}

        <TouchableOpacity
          className="mb-4 items-center rounded-[8px] bg-[#e30613] py-3"
          disabled={isSubmitting}
          onPress={() => {
            setLocalError(null);
            if (!name.trim()) {
              setLocalError('Lütfen adınızı giriniz.');
              return;
            }
            if (!email.trim()) {
              setLocalError('Lütfen e-posta adresinizi giriniz.');
              return;
            }
            if (!password.trim()) {
              setLocalError('Lütfen şifrenizi giriniz.');
              return;
            }
            if (password.length < 6) {
              setLocalError('Şifre en az 6 karakter olmalıdır.');
              return;
            }
            if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
              setLocalError('Şifre en az bir harf ve bir rakam içermelidir.');
              return;
            }
            if (!confirmPassword.trim()) {
              setLocalError('Lütfen şifrenizi tekrar giriniz.');
              return;
            }
            if (password !== confirmPassword) {
              setLocalError('Şifreler eşleşmiyor.');
              return;
            }
            if (!kvkkChecked) {
              setLocalError('Devam etmek için KVKK metnini onaylamalısınız.');
              return;
            }
            console.log('[RegisterForm] Attempting register with email:', email, 'name:', name);
            onRegister?.(name, email, password);
          }}
        >
          <ThemedText className="text-[14px] font-bold text-white">
            {isSubmitting ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
          </ThemedText>
        </TouchableOpacity>

        <View className="flex-row items-center justify-center gap-1">
          <ThemedText className="text-[12px] text-[#6b7280]">Hesabınız var mı?</ThemedText>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <ThemedText className="text-[12px] font-bold text-[#e30613]">Giriş yapın</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🏛️ MODAL: KURUMSAL KVKK AYDINLATMA METNİ PENCERESİ */}
      <Modal
        visible={kvkkModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setKvkkModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-4">
          <View className="w-full max-w-[360px] rounded-[16px] bg-white p-5 shadow-2xl">
            <View className="mb-3 flex-row items-center justify-between border-b border-[#e5e7eb] pb-2">
              <Text className="text-[16px] font-bold text-[#111827]">KVKK Aydınlatma Metni</Text>
              <TouchableOpacity onPress={() => setKvkkModalVisible(false)} className="p-1">
                <Text className="text-[18px] font-bold text-[#6b7280]">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-[260px] mb-4 pr-1" showsVerticalScrollIndicator>
              <Text className="text-[12px] leading-[18px] text-[#4b5563] font-semibold mb-1">
                1. Veri Sorumlusu
              </Text>
              <Text className="text-[12px] leading-[18px] text-[#6b7280] mb-3">
                Keşfet Edirne mobil uygulaması olarak, kişisel verilerinizin güvenliğine ogun işlenmesine azami hassasiyet gösteriyoruz.
              </Text>

              <Text className="text-[12px] leading-[18px] text-[#4b5563] font-semibold mb-1">
                2. İşlenen Verileriniz ve Amacı
              </Text>
              <Text className="text-[12px] leading-[18px] text-[#6b7280] mb-3">
                Kayıt esnasında sağladığınız Ad-Soyad ve E-posta verileriniz, kullanıcı profilinizin doğrulanması, güvenli giriş altyapısının sağlanması ve uygulama içerisinde oluşturduğunuz turistik rotaların kaydedilebilmesi amacıyla 6698 sayılı Kanun’un 5. maddesine uygun olarak işlenmektedir.
              </Text>

              <Text className="text-[12px] leading-[18px] text-[#4b5563] font-semibold mb-1">
                3. Verilerin Aktarılması ve Korunması
              </Text>
              <Text className="text-[12px] leading-[18px] text-[#6b7280] mb-3">
                Kişisel verileriniz ticari amaçlarla üçüncü kişilere asla satılmaz veya aktarılmaz. Verileriniz, veri tabanımızda şifrelenmiş (encrypted) olarak ve güncel siber güvenlik protokolleri altında saklanmaktadır.
              </Text>

              <Text className="text-[12px] leading-[18px] text-[#4b5563] font-semibold mb-1">
                4. Haklarınız
              </Text>
              <Text className="text-[12px] leading-[18px] text-[#6b7280]">
                Kanun’un 11. maddesi uyarınca dilediğiniz zaman uygulamanın destek hattı üzerinden verilerinizin silinmesini, güncellenmesini veya işlenip işlenmediği hakkında bilgi talep etme hakkına sahipsiniz.
              </Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setKvkkModalVisible(false)}
              className="w-full items-center rounded-[8px] bg-[#e30613] py-2.5"
            >
              <Text className="text-[13px] font-bold text-white">Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}