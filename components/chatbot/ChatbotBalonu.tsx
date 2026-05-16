import React from 'react';
import { Text, View } from 'react-native';

type ChatbotBalonuProps = {
  text: string;
  isUser?: boolean;
};

export default function ChatbotBalonu({ text, isUser = false }: ChatbotBalonuProps) {
  return (
    <View
      className={`mb-2 max-w-[85%] rounded-2xl px-3 py-2 ${
        isUser ? 'self-end bg-[#b10016]' : 'self-start bg-white border border-[#e5e7eb]'
      }`}
    >
      <Text className={isUser ? 'text-white text-[14px]' : 'text-[#111827] text-[14px]'}>{text}</Text>
    </View>
  );
}
