import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type ChatInputProps = {
  onSend: (message: string) => void;
  placeholder?: string;
};

export default function ChatInput({ onSend, placeholder = 'Mesaj yaz...' }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const message = value.trim();
    if (!message) return;
    onSend(message);
    setValue('');
  };

  return (
    <View className="flex-row items-center gap-2 border-t border-[#e5e7eb] bg-white px-3 py-2">
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        autoCapitalize="sentences"
        autoCorrect={true}
        spellCheck={false}
        className="flex-1 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-[14px]"
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <TouchableOpacity onPress={handleSend} className="rounded-xl bg-[#b10016] px-4 py-2">
        <Text className="text-[13px] font-bold text-white">Gönder</Text>
      </TouchableOpacity>
    </View>
  );
}