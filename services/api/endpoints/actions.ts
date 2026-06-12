import { apiRequest } from '../client';

export interface ApiActionResponse {
  status: number;
  bodyStatus?: string;
  success?: boolean;
  message?: string;
  error?: string;
  data?: unknown;
  route_id?: number | string;
  routeId?: number | string;
}

export interface CreateUserRoutePayload {
  user_id: number;
  route_name: string;
  description: string;
  places: Array<number | string>;
}

export interface FavoritePlaceItem {
  id: number | string;
  name: string;
  category?: string;
  district?: string;
  favorited_at?: string;
}

export interface FavoritePlacesResponse {
  status: number | string;
  bodyStatus?: string;
  results?: number;
  data?: FavoritePlaceItem[];
  message?: string;
  error?: string;
}

function isSuccessfulAction(response: ApiActionResponse) {
  return response.success === true || response.bodyStatus === 'success' || response.status === 200 || response.status === 201;
}

export async function togglePlaceFavorite(userId: number, placeId: number | string): Promise<ApiActionResponse> {
  try {
    console.log(`[PLACES_FAVORITE] Request başladı: POST /api/places/favorite`, { user_id: userId, place_id: placeId });

    const response = (await apiRequest('/api/places/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, place_id: placeId }),
    })) as ApiActionResponse;

    console.log('[PLACES_FAVORITE] Response geldi:', response);
    return response;
  } catch (error) {
    console.error('[PLACES_FAVORITE] HATA oluştu', error);
    throw error;
  }
}
export async function getFavoritePlaces(userId: number | string, token?: string): Promise<FavoritePlacesResponse> {
  try {
    console.log(`[PLACES_FAVORITES] Request başladı: GET /favorites/${userId}`);

    const response = (await apiRequest(`/api/places/favorites/${userId}`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })) as any; // Gelen dinamik yapıyı handle etmek için geçici any veya uygun bir tip

    console.log('[PLACES_FAVORITES] Response geldi:', response);

    // Gelen veri 200 veya success ise objeyi array'e çeviriyoruz
    if (response && (response.status === 200 || response.status === 'success')) {
      // "status" ve "bodyStatus" gibi mekan bilgisi olmayan key'leri ayıklayıp sadece mekanları array yapıyoruz
      const placesArray = Object.keys(response)
        .filter(key => !isNaN(Number(key))) // Sadece "0", "1", "2" gibi sayısal key'leri al
        .map(key => response[key]);

      return {
        status: response.status,
        bodyStatus: response.bodyStatus,
        data: placesArray, // Component artık burada tertemiz bir array görecek!
      };
    }

    return {
      status: response?.status ?? 400,
      data: []
    };
  } catch (error) {
    console.error('[PLACES_FAVORITES] HATA oluştu', error);
    throw error;
  }
}

export async function createUserRoute(payload: CreateUserRoutePayload, token?: string): Promise<ApiActionResponse> {
  try {
    console.log('[USER_ROUTE_CREATE] Request başladı: POST /api/user-routes/add', payload);

    const response = (await apiRequest('/api/user-routes/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })) as ApiActionResponse;

    console.log('[USER_ROUTE_CREATE] Response geldi:', response);
    return response;
  } catch (error) {
    console.error('[USER_ROUTE_CREATE] HATA oluştu', error);
    throw error;
  }
}

export async function shareUserRoute(routeId: number | string, token?: string): Promise<ApiActionResponse> {
  try {
    console.log(`[USER_ROUTE_SHARE] Request başladı: PUT /api/user-routes/share/${routeId}`);

    const response = (await apiRequest(`/api/user-routes/share/${routeId}`, {
      method: 'PUT',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })) as ApiActionResponse;

    console.log('[USER_ROUTE_SHARE] Response geldi:', response);
    return response;
  } catch (error) {
    console.error('[USER_ROUTE_SHARE] HATA oluştu', error);
    throw error;
  }
}

export { isSuccessfulAction };

