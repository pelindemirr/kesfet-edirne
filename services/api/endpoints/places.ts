import { apiRequest } from '../client';

export interface PlaceApiItem {
  id?: number | string;
  name?: string;
  title?: string;
  category?: string;
  district?: string;
  description?: string;
  address?: string;
  image?: string;
  image_url?: string;
  latitude?: number | string;
  longitude?: number | string;
}

export interface PlacesResponse {
  status: number;
  bodyStatus?: string;
  data?: PlaceApiItem[] | { places?: PlaceApiItem[] };
  message?: string;
  error?: string;
}

export type GetPlacesParams = {
  district?: string;
  category?: string;
  search?: string;
};

function buildPlacesQuery(params: GetPlacesParams) {
  const query = new URLSearchParams();

  if (params.district?.trim()) {
    query.set('district', params.district.trim());
  }

  if (params.category?.trim()) {
    query.set('category', params.category.trim());
  }

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  const queryString = query.toString();
  return queryString ? `/api/places?${queryString}` : '/api/places';
}

export async function getPlaces(params: GetPlacesParams = {}): Promise<PlacesResponse> {
  try {
    const path = buildPlacesQuery(params);
    console.log(`[PLACES] Request başladı: GET ${path}`);

    const response = (await apiRequest(path, {
      method: 'GET',
    })) as PlacesResponse;

    console.log('[PLACES] Response geldi:', response);
    return response;
  } catch (error) {
    console.error('[PLACES] HATA oluştu', error);
    throw error;
  }
}