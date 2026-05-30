import { apiRequest } from '../client';

export interface ProfileResponse {
  status: number;
  bodyStatus?: string;
  data?: {
    user?: {
      id: number;
      full_name?: string;
      email?: string;
      avatar?: string;
      login_streak?: number;
    };
    badges?: Array<{
      title: string;
      description?: string;
    }>;
  };
  message?: string;
  error?: string;
}

export interface AvatarItem {
  id: number;
  key: string;
  label: string;
}

export interface AvatarsListResponse {
  status?: number | string;
  bodyStatus?: string;
  data?: AvatarItem[];
  message?: string;
  error?: string;
}

export interface UpdateAvatarResponse {
  status: number | string;
  bodyStatus?: string;
  message?: string;
  error?: string;
}

export async function getProfile(userId: string | number, token: string): Promise<ProfileResponse> {
  try {
    const candidatePaths = [
      `/api/profile/${userId}`,
      `/profile/${userId}`,
      '/api/profile/me',
      '/profile/me',
    ];

    let lastResponse: ProfileResponse | null = null;

    for (const path of candidatePaths) {
      const response = await apiRequest(path, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }) as ProfileResponse;

      console.log(`[PROFILE] Response geldi (${path})`, response);
      lastResponse = response;

      if (response.status !== 404) {
        return response;
      }
    }

    return lastResponse ?? { status: 404 };
  } catch (error) {
    console.error('[PROFILE] HATA oluştu', error);
    throw error;
  }
}

export async function getAvatarsList(): Promise<AvatarsListResponse> {
  try {
    const avatarsList: AvatarItem[] = [
      { id: 1, key: 'Klasik', label: 'Klasik' },
      { id: 2, key: 'Sportif', label: 'Sportif' },
      { id: 3, key: 'Modern', label: 'Modern' },
      { id: 4, key: 'Zarif', label: 'Zarif' },
    ];

    console.log('[AVATARS] Using hardcoded list:', avatarsList);
    return { status: 'success', data: avatarsList };
  } catch (error) {
    console.error('[AVATARS] HATA:', error);
    throw error;
  }
}

export async function updateUserAvatar(
  userId: string | number,
  token: string,
  avatar: string
): Promise<UpdateAvatarResponse> {
  try {
    const requestPayload = { avatar };
    console.log(`[AVATAR_UPDATE] REQUEST - URL: /api/profile/${userId}/avatar, Method: PUT, Body:`, requestPayload);
    
    const response = await apiRequest(`/api/profile/${userId}/avatar`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    }) as UpdateAvatarResponse;

    console.log('[AVATAR_UPDATE] RESPONSE - Status:', response.status, 'Body:', response);
    return response;
  } catch (error) {
    console.error('[AVATAR_UPDATE] ERROR:', error);
    throw error;
  }
}
