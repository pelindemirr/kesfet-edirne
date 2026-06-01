import { apiRequest } from '../client';

export interface CommunityRouteApiItem {
  id?: number | string;
  route_name?: string;
  routeName?: string;
  creator_name?: string;
  creatorName?: string;
  creator_avatar?: string;
  creatorAvatar?: string;
  authorName?: string;
  author_name?: string;
  authorInitial?: string;
  author_initial?: string;
  createdAt?: string;
  created_at?: string;
  title?: string;
  description?: string;
  place_preview?: string;
  placePreview?: string;
  place_count?: number;
  placeCount?: number;
  stopCount?: number;
  stop_count?: number;
  district?: string;
  average_rating?: string | number;
  averageRating?: string | number;
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  commentCount?: number;
  comment_count?: number;
  popularityScore?: number;
  popularity_score?: number;
  views?: number;
}

export interface CommunityRoutesResponse {
  status: number;
  bodyStatus?: string;
  results?: number;
  data?: CommunityRouteApiItem[] | { routes?: CommunityRouteApiItem[] };
  message?: string;
  error?: string;
}

export interface CommunityRoutePlaceItem {
  name?: string;
  title?: string;
  description?: string;
  latitude?: number | string;
  longitude?: number | string;
}

export interface CommunityRouteDetailData {
  id?: number | string;
  route_name?: string;
  routeName?: string;
  description?: string;
  creator_name?: string;
  creatorName?: string;
  creator_avatar?: string;
  creatorAvatar?: string;
  district?: string;
  place_count?: number;
  placeCount?: number;
  place_preview?: string;
  placePreview?: string;
  average_rating?: string | number;
  averageRating?: string | number;
  review_count?: number;
  reviewCount?: number;
  places?: CommunityRoutePlaceItem[];
}

export interface CommunityRouteDetailResponse {
  status: number;
  bodyStatus?: string;
  data?: CommunityRouteDetailData;
  message?: string;
  error?: string;
}

export interface CommunityReviewResponse {
  status: number;
  bodyStatus?: string;
  message?: string;
  error?: string;
}

export async function getCommunityRoutes(): Promise<CommunityRoutesResponse> {
  try {
    console.log('[COMMUNITY_ROUTES] Request başladı: GET /api/community/routes');

    const response = await apiRequest('/api/community/routes', {
      method: 'GET',
    }) as CommunityRoutesResponse;

    console.log('[COMMUNITY_ROUTES] Response geldi:', response);
    return response;
  } catch (error) {
    console.error('[COMMUNITY_ROUTES] HATA oluştu', error);
    throw error;
  }
}

export async function getCommunityRouteById(routeId: number | string): Promise<CommunityRouteDetailResponse> {
  try {
    console.log(`[COMMUNITY_ROUTE_DETAIL] Request başladı: GET /api/community/routes/${routeId}`);

    const response = await apiRequest(`/api/community/routes/${routeId}`, {
      method: 'GET',
    }) as CommunityRouteDetailResponse;

    console.log('[COMMUNITY_ROUTE_DETAIL] Response geldi:', response);
    return response;
  } catch (error) {
    console.error('[COMMUNITY_ROUTE_DETAIL] HATA oluştu', error);
    throw error;
  }
}

export async function createCommunityReview(
  routeId: number | string,
  comment: string,
  rating: number,
  token?: string
): Promise<CommunityReviewResponse> {
  try {
    const requestBody = {
      route_id: routeId,
      comment,
      rating,
    };

    console.log('[COMMUNITY_REVIEW] Request başladı: POST /api/community/review', requestBody);

    const response = await apiRequest('/api/community/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(requestBody),
    }) as CommunityReviewResponse;

    console.log('[COMMUNITY_REVIEW] Response geldi:', response);
    return response;
  } catch (error) {
    console.error('[COMMUNITY_REVIEW] HATA oluştu', error);
    throw error;
  }
}

export async function getUserCreatedRoutes(userId: number | string, token?: string): Promise<CommunityRoutesResponse> {
  try {
    console.log(`[COMMUNITY_CREATED_ROUTES] Request başladı: GET /api/profile/${userId}/created-routes`);

    const response = await apiRequest(`/api/profile/${userId}/created-routes`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }) as CommunityRoutesResponse;

    console.log('[COMMUNITY_CREATED_ROUTES] Response geldi:', response);
    return response;
  } catch (error) {
    console.error('[COMMUNITY_CREATED_ROUTES] HATA oluştu', error);
    throw error;
  }
}

export async function getUserSavedRoutes(userId: number | string, token?: string): Promise<CommunityRoutesResponse> {
  try {
    console.log(`[COMMUNITY_SAVED_ROUTES] Request başladı: GET /api/profile/${userId}/saved-routes`);

    const response = await apiRequest(`/api/profile/${userId}/saved-routes`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }) as CommunityRoutesResponse;

    console.log('[COMMUNITY_SAVED_ROUTES] Response geldi:', response);
    return response;
  } catch (error) {
    console.error('[COMMUNITY_SAVED_ROUTES] HATA oluştu', error);
    throw error;
  }
}
