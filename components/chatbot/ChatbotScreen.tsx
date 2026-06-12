import { sendChatMessage } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';

const chatbotIcon = require('../../assets/chatbot/chatbot .png');

const COLORS = {
  primary: '#B10016',
  primaryDark: '#830012',
  background: '#F5F6FA',
  surface: '#FFFFFF',
  text: '#1F2933',
  muted: '#7B8794',
  border: '#E4E7EC',
  botBubble: '#FFFFFF',
  inputBg: '#F8FAFC',
};

interface ConversationNode {
  text: string;
  options: Array<{
    label: string;
    nextId: string;
  }>;
  keywords?: string[];
}

interface ConversationFlow {
  [key: string]: ConversationNode;
}

const CONVERSATION_FLOW: ConversationFlow = {
  start: {
    text: 'Merhaba! Ben Sanal Kızan. Edirne hakkında sana yardımcı olabilirim.',
    options: [
      { label: '🏛️ Edirne Tarihi', nextId: 'tarih' },
      { label: '🗺️ Edirne Rota', nextId: 'rota' },
      { label: '🍽️ Ne Yenir?', nextId: 'yemek' },
    ],
    keywords: ['başla', 'menu', 'ana', 'merhaba'],
  },
  tarih: {
    text: 'Edirne, Osmanlı’ya 92 yıl başkentlik yapmış önemli bir şehirdir. En bilinen eseri, Mimar Sinan’ın ustalık eseri olarak kabul edilen Selimiye Camii’dir.',
    options: [
      { label: '🕌 Selimiye Camii', nextId: 'selimiye' },
      { label: '← Ana Menü', nextId: 'start' },
    ],
    keywords: ['tarih', 'osmanlı', 'tarihi'],
  },
  rota: {
    text: 'Güzel bir rota önerim var: Selimiye Camii ile başla, Arasta Çarşısı’nı gez, ardından Meriç Köprüsü’nde gün batımını izle.',
    options: [
      { label: '✨ Başka Rota?', nextId: 'rota_alternatif' },
      { label: '← Ana Menü', nextId: 'start' },
    ],
    keywords: ['rota', 'rotalar', 'gezinti', 'tur'],
  },
  yemek: {
    text: 'Edirne’de mutlaka ciğer tava, köfte, badem ezmesi ve muhallebi denemelisin.',
    options: [
      { label: '🍲 Daha Fazla Bilgi', nextId: 'yemek_detay' },
      { label: '← Ana Menü', nextId: 'start' },
    ],
    keywords: ['yemek', 'ne yenir', 'aç', 'karnım acıktı'],
  },
  selimiye: {
    text: 'Selimiye Camii, 1575 yılında tamamlanmıştır. Mimar Sinan’ın en önemli eserlerinden biridir ve Edirne’nin simgelerindendir.',
    options: [
      { label: '← Tarih Menüsüne Dön', nextId: 'tarih' },
      { label: '← Ana Menü', nextId: 'start' },
    ],
    keywords: ['selimiye', 'cami', 'camii', 'sinan', 'mimar'],
  },
  rota_alternatif: {
    text: 'Alternatif rota: Meriç Nehri çevresinde yürüyüş yap, Eski Cami’yi ziyaret et, Arasta Çarşısı’nda dolaş ve lokal bir kafede mola ver.',
    options: [
      { label: '← Rota Menüsüne Dön', nextId: 'rota' },
      { label: '← Ana Menü', nextId: 'start' },
    ],
    keywords: ['alternatif', 'başka', 'diğer', 'meriç', 'nehir'],
  },
  yemek_detay: {
    text: 'Ciğer tava Edirne’nin en meşhur lezzetlerinden biridir. Yanında kuru biberle servis edilir. Tatlı olarak badem ezmesi ve muhallebi iyi bir tercih olur.',
    options: [
      { label: '← Yemek Menüsüne Dön', nextId: 'yemek' },
      { label: '← Ana Menü', nextId: 'start' },
    ],
    keywords: ['detay', 'detaylı', 'köfte', 'ciğer', 'muhallebi', 'badem'],
  },
};

type Message = {
  type: 'bot' | 'user';
  nodeId?: string;
  text: string;
};

type ChatbotScreenProps = {
  onClose?: () => void;
};

export default function ChatbotScreen({ onClose }: ChatbotScreenProps) {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<Message[]>([
    { type: 'bot', nodeId: 'start', text: CONVERSATION_FLOW.start.text },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const currentNode = CONVERSATION_FLOW[currentNodeId];

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const findNodeByKeyword = (text: string): string | null => {
    const normalizedInput = text.toLocaleLowerCase('tr-TR').trim();

    for (const [nodeId, node] of Object.entries(CONVERSATION_FLOW)) {
      if (node.keywords?.some(keyword => normalizedInput.includes(keyword.toLowerCase()))) {
        return nodeId;
      }
    }

    return null;
  };

  const handleTextSubmit = async () => {
    const trimmedText = inputText.trim();

    if (!trimmedText) return;

    // Kullanıcı mesajını ekle
    const newHistory: Message[] = [
      ...history,
      { type: 'user', text: trimmedText },
    ];

    setHistory(newHistory);
    setInputText('');

    try {
      setIsLoading(true);
      // Backend API'ye istek gönder
      const botResponse = await sendChatMessage(trimmedText);

      // Bot yanıtını ekle
      newHistory.push({ type: 'bot', text: botResponse });
      setHistory(newHistory);

      // Eğer kullanıcının yazdığı metin önceden tanımlı düğme/konuşma akışına işaret ediyorsa,
      // ilgili düğmeleri göster (ilk bot cevabını gösterdikten sonra).
      const matchedNode = findNodeByKeyword(trimmedText);
      if (matchedNode) {
        setCurrentNodeId(matchedNode);
      }
    } catch (error) {
      // Hata durumunda fallback mesaj
      newHistory.push({
        type: 'bot',
        text: 'Şu anda chatbot\'a ulaşılamıyor. Lütfen daha sonra tekrar deneyiniz.',
      });
      setHistory(newHistory);
    } finally {
      setIsLoading(false);
    }

    scrollToBottom();
  };

  const handleOptionPress = (nextId: string, buttonLabel: string) => {
    if (isLoading) return;
    const newHistory: Message[] = [
      ...history,
      { type: 'user', text: buttonLabel },
      { type: 'bot', nodeId: nextId, text: CONVERSATION_FLOW[nextId].text },
    ];

    setCurrentNodeId(nextId);
    setHistory(newHistory);
    scrollToBottom();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.logoCircle}>
              <Image source={chatbotIcon} style={styles.logoImage} />
            </View>

            <View>
              <Text style={styles.headerTitle}>Merhaba Ben Sanal Kızan</Text>

              <View style={styles.statusRow}>
                
                <Text style={styles.headerSubtitle}> Tarih, rota ve yemek için sorularınızı bekliyorum </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={22} color="white" />
          </TouchableOpacity>
        </View>

       
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {history.map((item, index) => (
          <View
            key={`${item.type}-${index}`}
            style={[
              styles.messageRow,
              item.type === 'user' ? styles.userMessageRow : styles.botMessageRow,
            ]}
          >
            {item.type === 'bot' && (
              <View style={styles.botAvatar}>
                <Image source={chatbotIcon} style={styles.botAvatarIcon} />
              </View>
            )}

            <View
              style={[
                styles.messageBubble,
                item.type === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.type === 'user' ? styles.userText : styles.botText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomPanel}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.optionsContent}
        >
            {isLoading && (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 8 }} />
            )}
            {currentNode?.options.map((option, index) => (
              <TouchableOpacity
                key={`${option.nextId}-${index}`}
                style={[styles.optionButton, isLoading ? styles.optionButtonDisabled : null]}
                onPress={() => handleOptionPress(option.nextId, option.label)}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                <Text style={styles.optionButtonText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tarih, rota, yemek..."
              placeholderTextColor="#98A2B3"
                value={inputText}
                onChangeText={(t) => {
                  try {
                    console.log('[Chatbot] input change:', t);
                  } catch (e) {}
                  setInputText(t);
                }}
                onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
                  try {
                    console.log('[Chatbot] keypress:', e.nativeEvent.key);
                  } catch (err) {}
                }}
                onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
                  try {
                    console.log('[Chatbot] change event:', e.nativeEvent.text);
                  } catch (err) {}
                }}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
              onSubmitEditing={handleTextSubmit}
              returnKeyType="send"
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={() => {
                if (isLoading) return;
                handleTextSubmit();
              }}
              activeOpacity={0.85}
              disabled={isLoading || !inputText.trim()}
            >
              <Ionicons name="send" size={19} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...shadow,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  logoImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#40D98F',
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
    fontWeight: '500',
  },
  headerDescription: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 14,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 18,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  botAvatarIcon: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  botBubble: {
    backgroundColor: COLORS.botBubble,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    ...shadow,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: COLORS.text,
  },
  userText: {
    color: 'white',
    fontWeight: '500',
  },
  bottomPanel: {
    backgroundColor: COLORS.surface,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    ...shadow,
  },
  optionsContent: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 8,
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionButtonText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    backgroundColor: COLORS.inputBg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    height: 42,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
});