import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { getSavedCommunityRoutes, saveCommunityRoute as saveCommunityRouteRequest, unsaveCommunityRoute as unsaveCommunityRouteRequest } from '@/services/api/endpoints/community';
import { useAuthStore } from '@/stores/use-auth-store';

export interface RoutePoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'historical' | 'nature' | 'cultural' | 'food' | 'other';
}

export interface UserRoute {
  id: string;
  name: string;
  description: string;
  points: RoutePoint[];
  createdAt: Date;
  isSaved: boolean;
  isShared: boolean;
  likes: number;
  tags: string[];
  duration: number; // saat cinsinden
}

export interface CommunitySavedRoute {
  id: string;
  title: string;
  description: string;
  authorName: string;
  authorInitial: string;
  createdAt: string;
  placePreview: string;
  stopCount: number;
  district: string;
  rating: number;
  reviewCount: number;
  commentCount: number;
  popularityScore: number;
  creatorAvatarId?: string;
}

export interface RoutesContextType {
  // Rota yönetimi
  userRoutes: UserRoute[];
  savedRoutes: UserRoute[];
  savedCommunityRoutes: CommunitySavedRoute[];
  savedCommunityRoutesLoading: boolean;
  sharedRoutes: UserRoute[];
  
  // Rota ekleme/güncelleme
  addRoute: (route: Omit<UserRoute, 'id' | 'createdAt'>) => void;
  saveRoute: (routeId: string) => void;
  unsaveRoute: (routeId: string) => void;
  saveCommunityRoute: (route: CommunitySavedRoute) => Promise<boolean>;
  unsaveCommunityRoute: (routeId: string) => Promise<boolean>;
  isCommunityRouteSaved: (routeId: string) => boolean;
  shareRoute: (routeId: string) => void;
  unshareRoute: (routeId: string) => void;
  deleteRoute: (routeId: string) => void;
  likeRoute: (routeId: string) => void;
  
  // İstatistikler
  getTotalRoutesCount: () => number;
  getTotalSavedCount: () => number;
  getTotalSharedCount: () => number;
  getHistoricalRoutesCount: () => number;
  getNatureRoutesCount: () => number;
  getTotalVisitedPlaces: () => number;
  getTotalLikesReceived: () => number;
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

function normalizeSavedCommunityRoute(route: any): CommunitySavedRoute {
  const fallbackAuthorName = route.authorName ?? route.creatorName ?? route.creator_name ?? 'K';
  const computedAuthorInitial = fallbackAuthorName.trim().charAt(0).toLocaleUpperCase('tr-TR');
  const authorInitial = route.authorInitial ?? route.author_initial ?? (computedAuthorInitial || 'K');

  return {
    id: String(route.id ?? ''),
    title: route.title ?? route.routeName ?? route.route_name ?? 'Rota',
    description: route.description ?? '',
    authorName: route.authorName ?? route.creatorName ?? route.creator_name ?? 'Anonim Kullanici',
    authorInitial,
    createdAt: route.createdAt ?? route.created_at ?? '',
    placePreview: route.placePreview ?? route.place_preview ?? '',
    stopCount: Number(route.stopCount ?? route.stop_count ?? route.placeCount ?? route.place_count ?? 0),
    district: route.district ?? 'Bilinmiyor',
    rating: Number(route.rating ?? route.averageRating ?? route.average_rating ?? 0) || 0,
    reviewCount: Number(route.reviewCount ?? route.review_count ?? route.commentCount ?? route.comment_count ?? 0) || 0,
    commentCount: Number(route.commentCount ?? route.comment_count ?? route.reviewCount ?? route.review_count ?? 0) || 0,
    popularityScore: Number(route.popularityScore ?? route.popularity_score ?? route.views ?? 0) || 0,
    creatorAvatarId: route.creatorAvatarId ?? route.creatorAvatar ?? route.creator_avatar,
  };
}

export function RoutesProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [userRoutes, setUserRoutes] = useState<UserRoute[]>([
    // Demo veri
    {
      id: '1',
      name: 'Selimiye Turu',
      description: 'Tarihi Selimiye Camii ve çevresini gezin',
      points: [
        { id: 'p1', name: 'Selimiye Camii', latitude: 41.1596, longitude: 26.5557, type: 'historical' },
        { id: 'p2', name: 'Arasta Çarşısı', latitude: 41.1587, longitude: 26.5548, type: 'cultural' },
      ],
      createdAt: new Date('2026-05-01'),
      isSaved: true,
      isShared: true,
      likes: 5,
      tags: ['tarih', 'selimiye', 'osmanlı'],
      duration: 3,
    },
    {
      id: '2',
      name: 'Meriç Nehri Gezisi',
      description: 'Doğal güzelliğiyle ünlü Meriç Nehri kenarında yürüyüş',
      points: [
        { id: 'p3', name: 'Meriç Köprüsü', latitude: 41.1633, longitude: 26.5604, type: 'nature' },
      ],
      createdAt: new Date('2026-04-28'),
      isSaved: true,
      isShared: false,
      likes: 0,
      tags: ['doğa', 'nehir', 'meriç'],
      duration: 2,
    },
    {
      id: '3',
      name: 'Edirne Yemek Turu',
      description: 'Geleneksel Edirne yemeklerini tatma turu',
      points: [
        { id: 'p4', name: 'Eski Restoran', latitude: 41.1567, longitude: 26.5525, type: 'food' },
      ],
      createdAt: new Date('2026-04-20'),
      isSaved: false,
      isShared: false,
      likes: 0,
      tags: ['yemek', 'geleneksel', 'mutfak'],
      duration: 2,
    },
  ]);
  const [savedCommunityRoutes, setSavedCommunityRoutes] = useState<CommunitySavedRoute[]>([]);
  const [savedCommunityRoutesLoading, setSavedCommunityRoutesLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSavedCommunityRoutes() {
      if (!isLoggedIn || !token) {
        setSavedCommunityRoutes([]);
        setSavedCommunityRoutesLoading(false);
        return;
      }

      try {
        setSavedCommunityRoutesLoading(true);
        const response = await getSavedCommunityRoutes(token);

        if (!mounted) return;

        if (response.status === 200 || response.bodyStatus === 'success') {
          const responseData = response.data;
          const items = Array.isArray(responseData)
            ? responseData
            : Array.isArray((responseData as { routes?: unknown[] } | undefined)?.routes)
              ? (responseData as { routes?: unknown[] }).routes ?? []
              : [];

          setSavedCommunityRoutes(items.map((item) => normalizeSavedCommunityRoute(item)));
        } else {
          setSavedCommunityRoutes([]);
        }
      } catch (error) {
        console.error('[RoutesContext] loadSavedCommunityRoutes error', error);
        if (mounted) {
          setSavedCommunityRoutes([]);
        }
      } finally {
        if (mounted) {
          setSavedCommunityRoutesLoading(false);
        }
      }
    }

    loadSavedCommunityRoutes();

    return () => {
      mounted = false;
    };
  }, [isLoggedIn, token]);

  const addRoute = useCallback((route: Omit<UserRoute, 'id' | 'createdAt'>) => {
    const newRoute: UserRoute = {
      ...route,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUserRoutes((prev) => [newRoute, ...prev]);
  }, []);

  const saveRoute = useCallback((routeId: string) => {
    setUserRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId ? { ...route, isSaved: true } : route
      )
    );
  }, []);

  const unsaveRoute = useCallback((routeId: string) => {
    setUserRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId ? { ...route, isSaved: false } : route
      )
    );
  }, []);

  const saveCommunityRoute = useCallback(async (route: CommunitySavedRoute) => {
    if (!token) {
      return false;
    }

    const response = await saveCommunityRouteRequest(route.id, token);
    if (response.status === 200 || response.status === 201 || response.bodyStatus === 'success') {
      setSavedCommunityRoutes((prev) => {
        const exists = prev.some((item) => item.id === route.id);
        if (exists) {
          return prev.map((item) => (item.id === route.id ? route : item));
        }

        return [route, ...prev];
      });
      return true;
    }

    return false;
  }, [token]);

  const unsaveCommunityRoute = useCallback(async (routeId: string) => {
    if (!token) {
      return false;
    }

    const response = await unsaveCommunityRouteRequest(routeId, token);
    if (response.status === 200 || response.status === 204 || response.bodyStatus === 'success') {
      setSavedCommunityRoutes((prev) => prev.filter((route) => route.id !== routeId));
      return true;
    }

    return false;
  }, [token]);

  const isCommunityRouteSaved = useCallback(
    (routeId: string) => savedCommunityRoutes.some((route) => route.id === routeId),
    [savedCommunityRoutes],
  );

  const shareRoute = useCallback((routeId: string) => {
    setUserRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId ? { ...route, isShared: true } : route
      )
    );
  }, []);

  const unshareRoute = useCallback((routeId: string) => {
    setUserRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId ? { ...route, isShared: false } : route
      )
    );
  }, []);

  const deleteRoute = useCallback((routeId: string) => {
    setUserRoutes((prev) => prev.filter((route) => route.id !== routeId));
  }, []);

  const likeRoute = useCallback((routeId: string) => {
    setUserRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId ? { ...route, likes: route.likes + 1 } : route
      )
    );
  }, []);

  const savedRoutes = userRoutes.filter((route) => route.isSaved);
  const sharedRoutes = userRoutes.filter((route) => route.isShared);

  const getTotalRoutesCount = () => userRoutes.length;
  const getTotalSavedCount = () => savedRoutes.length + savedCommunityRoutes.length;
  const getTotalSharedCount = () => sharedRoutes.length;
  
  const getHistoricalRoutesCount = () =>
    userRoutes.filter((route) =>
      route.points.some((p) => p.type === 'historical')
    ).length;

  const getNatureRoutesCount = () =>
    userRoutes.filter((route) =>
      route.points.some((p) => p.type === 'nature')
    ).length;

  const getTotalVisitedPlaces = () =>
    userRoutes.reduce((acc, route) => acc + route.points.length, 0);

  const getTotalLikesReceived = () =>
    sharedRoutes.reduce((acc, route) => acc + route.likes, 0);

  const value: RoutesContextType = {
    userRoutes,
    savedRoutes,
    savedCommunityRoutes,
    savedCommunityRoutesLoading,
    sharedRoutes,
    addRoute,
    saveRoute,
    unsaveRoute,
    saveCommunityRoute,
    unsaveCommunityRoute,
    isCommunityRouteSaved,
    shareRoute,
    unshareRoute,
    deleteRoute,
    likeRoute,
    getTotalRoutesCount,
    getTotalSavedCount,
    getTotalSharedCount,
    getHistoricalRoutesCount,
    getNatureRoutesCount,
    getTotalVisitedPlaces,
    getTotalLikesReceived,
  };

  return (
    <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>
  );
}

export function useRoutes() {
  const context = useContext(RoutesContext);
  if (context === undefined) {
    throw new Error('useRoutes must be used within a RoutesProvider');
  }
  return context;
}
