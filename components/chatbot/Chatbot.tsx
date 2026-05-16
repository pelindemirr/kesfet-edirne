import { IconSymbol } from '@/components/ui/icon-symbol';
import { useChat } from '@/hooks/useChat';
import { sendChatMessage } from '@/services/api/chat';
import React, { useState } from 'react';
import { FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import ChatbotBalonu from './ChatbotBalonu';
import ChatInput from './ChatInput';

const chatbotIcon = require('../../assets/chatbot/chatbot .png');

export default function Chatbot() {
  const { messages, addUserMessage, addBotMessage } = useChat();
  const [open, setOpen] = useState(false);

  const handleSend = async (text: string) => {
    addUserMessage(text);
    try {
      const reply = await sendChatMessage(text);
      addBotMessage(reply);
    } catch (e) {
      addBotMessage('Sunucuya bağlanılamadı.');
    }
  };

  return (
    <>
      <Modal visible={open} animationType="slide" transparent>
        <View className="flex-1 items-end justify-end p-4">
          <View className="w-full max-w-[420px] rounded-t-2xl bg-white shadow-lg p-3">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Sohbet</Text>
              <TouchableOpacity onPress={() => setOpen(false)} className="p-2">
                <IconSymbol name="chevron.right" size={20} color="#111" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ChatbotBalonu text={item.text} isUser={item.isUser} />}
              inverted
              contentContainerStyle={{ flexDirection: 'column-reverse' }}
            />

            <ChatInput onSend={handleSend} />
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="absolute bottom-6 right-4 h-14 w-14 items-center justify-center rounded-full bg-[#D32F2F] shadow-lg"
      >
        <Image source={chatbotIcon} className="h-9 w-9" resizeMode="contain" />
      </TouchableOpacity>
    </>
  );
}
