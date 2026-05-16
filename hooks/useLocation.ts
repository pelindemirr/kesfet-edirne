import { useMemo } from 'react';

export type UserLocation = {
  latitude: number;
  longitude: number;
  city?: string;
};

export function useLocation() {
  // Bu asamada yalnizca iskelet sagliyoruz.
  const location = useMemo<UserLocation | null>(() => null, []);

  return {
    location,
    isLoading: false,
    error: null as string | null,
  };
}
