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
