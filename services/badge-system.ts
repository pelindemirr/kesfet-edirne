// Rozet sistemi tanımı

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
}

export interface UserBadgeData {
  totalSavedRoutes: number;
  totalSharedRoutes: number;
  totalVisitedPlaces: number;
  totalEvents: number;
  historicalRoutesCreated: number;
  natureRoutesCreated: number;
  totalFavoritesReceived: number;
  daysActive: number;
  communityContributions: number;
}

// Rozet tanımlamaları
export const BADGES = {
  // Başlangıç Rozeti
  starter: {
    id: 'starter',
    name: 'Başlayan Gezgin',
    description: 'İlk rotanızı kaydediniz',
    icon: '🚀',
    color: 'blue' as const,
    tier: 'bronze' as const,
    condition: (data: UserBadgeData) => data.totalSavedRoutes >= 1,
  },
  // Deneyim Rozetleri
  explorer_5: {
    id: 'explorer_5',
    name: 'Meraklı Gezgin',
    description: '5 rota kaydetme başarısı',
    icon: '🗺️',
    color: 'blue' as const,
    tier: 'silver' as const,
    condition: (data: UserBadgeData) => data.totalSavedRoutes >= 5,
  },
  explorer_10: {
    id: 'explorer_10',
    name: 'Deneyimli Gezgin',
    description: '10 rota kaydetme başarısı',
    icon: '🧭',
    color: 'blue' as const,
    tier: 'gold' as const,
    condition: (data: UserBadgeData) => data.totalSavedRoutes >= 10,
  },
  explorer_25: {
    id: 'explorer_25',
    name: 'Efsanevi Gezgin',
    description: '25 rota kaydetme başarısı',
    icon: '👑',
    color: 'blue' as const,
    tier: 'platinum' as const,
    condition: (data: UserBadgeData) => data.totalSavedRoutes >= 25,
  },
  // Paylaşım Rozetleri
  sharer: {
    id: 'sharer',
    name: 'Rota Paylaşıcısı',
    description: 'Rotanızı toplulukla paylaşınız',
    icon: '🤝',
    color: 'green' as const,
    tier: 'bronze' as const,
    condition: (data: UserBadgeData) => data.totalSharedRoutes >= 1,
  },
  social_butterfly: {
    id: 'social_butterfly',
    name: 'Sosyal Kelebek',
    description: '5 rota paylaşma başarısı',
    icon: '🦋',
    color: 'green' as const,
    tier: 'silver' as const,
    condition: (data: UserBadgeData) => data.totalSharedRoutes >= 5,
  },
  community_star: {
    id: 'community_star',
    name: 'Komunite Yıldızı',
    description: '10 rota paylaşma ve beğeni toplama',
    icon: '⭐',
    color: 'yellow' as const,
    tier: 'gold' as const,
    condition: (data: UserBadgeData) => 
      data.totalSharedRoutes >= 10 && data.totalFavoritesReceived >= 5,
  },
  // Ziyaret Rozetleri
  visitor: {
    id: 'visitor',
    name: 'Gezginlik Başladı',
    description: '5 farklı yer ziyaret etme',
    icon: '👣',
    color: 'orange' as const,
    tier: 'bronze' as const,
    condition: (data: UserBadgeData) => data.totalVisitedPlaces >= 5,
  },
  world_traveler: {
    id: 'world_traveler',
    name: 'Dünya Gezgini',
    description: '20 farklı yer ziyaret etme',
    icon: '🌍',
    color: 'orange' as const,
    tier: 'gold' as const,
    condition: (data: UserBadgeData) => data.totalVisitedPlaces >= 20,
  },
  // Tema Rozetleri
  history_buff: {
    id: 'history_buff',
    name: 'Tarih Meraklısı',
    description: '5 tarihi durak içeren rota oluşturma',
    icon: '🏛️',
    color: 'purple' as const,
    tier: 'silver' as const,
    condition: (data: UserBadgeData) => data.historicalRoutesCreated >= 5,
  },
  nature_lover: {
    id: 'nature_lover',
    name: 'Doğa Seveni',
    description: '5 doğa temalı rota oluşturma',
    icon: '🌿',
    color: 'green' as const,
    tier: 'silver' as const,
    condition: (data: UserBadgeData) => data.natureRoutesCreated >= 5,
  },
  // Etkinlik Rozetleri
  event_participant: {
    id: 'event_participant',
    name: 'Etkinlik Katılımcısı',
    description: '3 etkinliğe katılma',
    icon: '🎉',
    color: 'red' as const,
    tier: 'silver' as const,
    condition: (data: UserBadgeData) => data.totalEvents >= 3,
  },
  event_enthusiast: {
    id: 'event_enthusiast',
    name: 'Etkinlik Tutkunası',
    description: '10 etkinliğe katılma',
    icon: '🎊',
    color: 'red' as const,
    tier: 'gold' as const,
    condition: (data: UserBadgeData) => data.totalEvents >= 10,
  },
  // Loyal Rozeti
  loyal_member: {
    id: 'loyal_member',
    name: 'Sadık Üye',
    description: '30 gün aktif kullanıcı',
    icon: '💎',
    color: 'purple' as const,
    tier: 'gold' as const,
    condition: (data: UserBadgeData) => data.daysActive >= 30,
  },
  // Katkı Rozeti
  community_contributor: {
    id: 'community_contributor',
    name: 'Komunite Katkıcısı',
    description: 'Toplulukla etkin katılım',
    icon: '🌟',
    color: 'yellow' as const,
    tier: 'gold' as const,
    condition: (data: UserBadgeData) => 
      data.communityContributions >= 10 || 
      (data.totalSharedRoutes >= 3 && data.totalEvents >= 2),
  },
};

// Tüm rozetleri döndüren fonksiyon
export function getAllBadges(): typeof BADGES {
  return BADGES;
}

// Kullanıcı verilerine göre kazanılan rozetleri hesaplayan fonksiyon
export function calculateUnlockedBadges(userData: UserBadgeData): Badge[] {
  const unlockedBadges: Badge[] = [];

  for (const badgeKey in BADGES) {
    const badge = BADGES[badgeKey as keyof typeof BADGES];
    if (badge.condition(userData)) {
      unlockedBadges.push({
        ...badge,
        unlocked: true,
      });
    }
  }

  return unlockedBadges;
}

// Rozetleri tier'a göre sıralayan fonksiyon
export function sortBadgesByTier(badges: Badge[]): Badge[] {
  const tierOrder = { bronze: 0, silver: 1, gold: 2, platinum: 3 };
  return badges.sort((a, b) => tierOrder[b.tier] - tierOrder[a.tier]);
}

// Badge renk kodları
export const BADGE_COLORS: Record<Badge['color'], string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  purple: '#a855f7',
  orange: '#f97316',
};

// Badge tier arka plan renkleri
export const BADGE_TIER_BG: Record<Badge['tier'], string> = {
  bronze: '#f3f4f6',
  silver: '#e0e7ff',
  gold: '#fef3c7',
  platinum: '#f3e8ff',
};
