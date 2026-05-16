import { useState } from 'react';

export type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, text, isUser: true },
    ]);
  };

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-bot`, text, isUser: false },
    ]);
  };

  return {
    messages,
    addUserMessage,
    addBotMessage,
  };
}
