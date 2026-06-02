import { apiRequest } from './client';

type ChatApiResponse = {
  success?: boolean;
  reply?: string;
  message?: string;
  error?: string;
};

function getMockChatReply(message: string) {
  const normalized = message.toLocaleLowerCase('tr-TR');

  if (normalized.includes('rota') || normalized.includes('gezi') || normalized.includes('tur')) {
    return 'Mock cevap: Edirne için Selimiye Camii, Arasta Çarşısı ve Meriç Köprüsü ile kısa bir rota hazırlayabilirim.';
  }

  if (normalized.includes('hazır rota') || normalized.includes('hazir rota') || normalized.includes('hazır rotalar') || normalized.includes('hazir rotalar')) {
    return 'Mock cevap: Hazır rotalar arasında Selimiye Turu, Meriç Nehri Gezisi ve Tarihi Merkez rotası var; istersen birini detaylandırabilirim.';
  }

  if (normalized.includes('menü') || normalized.includes('menu') || normalized.includes('profil')) {
    return 'Mock cevap: Menüden profil bilgilerini, kaydedilen rotaları ve ayarları görebilirsin. Profil sekmesinde kaydettiğin rotalar listelenir.';
  }

  if (normalized.includes('etkinlik') || normalized.includes('event') || normalized.includes('neler var')) {
    return 'Mock cevap: Etkinlikler bölümünde Edirne’deki güncel etkinlikleri takip edebilirsin. İstersen sana uygun bir etkinlik türü de önerebilirim.';
  }

  if (normalized.includes('topluluk') || normalized.includes('community') || normalized.includes('paylaş')) {
    return 'Mock cevap: Topluluk bölümünde diğer kullanıcıların paylaştığı rotaları görebilir, kaydedebilir ve detaylarına bakabilirsin.';
  }

  if (normalized.includes('tarih') || normalized.includes('selimiye') || normalized.includes('osmanlı')) {
    return 'Mock cevap: Edirne, Osmanlı döneminde önemli bir merkezdi. Selimiye Camii şehrin en güçlü simgelerinden biridir.';
  }

  if (normalized.includes('yemek') || normalized.includes('ne yenir') || normalized.includes('ciğer')) {
    return 'Mock cevap: Edirne tava ciğer, badem ezmesi ve kavala ile öne çıkar.';
  }

  if (normalized.includes('merhaba') || normalized.includes('selam')) {
    return 'Mock cevap: Merhaba, Edirne hakkında rota, tarih ve yemek sorularını yanıtlayabilirim.';
  }

  return 'Mock cevap: Şu anda Gemini yanıtı gelmedi, ama Edirne hakkında rota, tarih ve yemek sorularında yardımcı olabilirim.';
}

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
    }) as ChatApiResponse;

    if (response.success === true && response.reply) {
      return response.reply;
    }

    if (response.reply) {
      return response.reply;
    }

    if (response.success === false) {
      throw new Error(response.error || response.message || 'Chat isteği başarısız oldu.');
    }

    return getMockChatReply(message);
  } catch (error) {
    console.error('Chat API Error:', error);
    return getMockChatReply(message);
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
    return !!response && (response as { success?: boolean }).success !== false;
  } catch (error) {
    console.error('Chatbot Health Check Error:', error);
    return false;
  }
}
