import { apiRequest } from './client';

/**
 * Chatbot'a mesaj gönder ve yanıt al
 */
export async function sendChatMessage(message: string): Promise<string> {
  try {
    const response = await apiRequest('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    }) as { reply?: string };

    if (response?.reply) {
      return response.reply;
    }

    return 'Üzgünüm, yanıt alınamadı. Lütfen tekrar deneyiniz.';
  } catch (error) {
    console.error('Chat API Error:', error);
    // Fallback mock response for development
    return `Bot (offline): "${message}" kaydedildi. Backend bağlantısı kurulduğunda gerçek yanıtlar alacaksınız.`;
  }
}

/**
 * Chatbot'un mevcut olup olmadığını kontrol et
 */
export async function checkChatbotStatus(): Promise<boolean> {
  try {
    const response = await apiRequest('/api/chat/health', {
      method: 'GET',
    });
    return !!response;
  } catch (error) {
    console.error('Chatbot Health Check Error:', error);
    return false;
  }
}
