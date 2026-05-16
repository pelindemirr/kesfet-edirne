import React, { createContext, useCallback, useContext, useState } from 'react';

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

export interface RoutesContextType {
  // Rota yönetimi
  userRoutes: UserRoute[];
  savedRoutes: UserRoute[];
  sharedRoutes: UserRoute[];
  
  // Rota ekleme/güncelleme
  addRoute: (route: Omit<UserRoute, 'id' | 'createdAt'>) => void;
  saveRoute: (routeId: string) => void;
  unsaveRoute: (routeId: string) => void;
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

export function RoutesProvider({ children }: { children: React.ReactNode }) {
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
  const getTotalSavedCount = () => savedRoutes.length;
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
    sharedRoutes,
    addRoute,
    saveRoute,
    unsaveRoute,
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
