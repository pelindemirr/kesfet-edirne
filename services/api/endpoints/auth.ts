// Tüm auth endpoint fonksiyonları burada
import { apiRequest } from '../client';

export interface LoginResponse {
  status: number;
  bodyStatus?: string;
  success?: boolean;
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
  token?: string;
  message?: string;
  error?: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  console.log('[LOGIN] Request başladı', { email });

  try {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }) as LoginResponse;

    console.log('[LOGIN] Response geldi', response);
    
    // Accept responses that explicitly indicate success, or have 200/201 status.
    const okStatus = response.status === 200 || response.status === 201;
    const explicitSuccess = response.success === true;

    if (!explicitSuccess && !okStatus) {
      throw new Error(response.error || response.message || 'Giriş başarısız');
    }

    return response;
  } catch (error) {
    console.error('[LOGIN] HATA oluştu', error);
    throw error;
  } finally {
    console.log('[LOGIN] Request bitti');
  }
}


export interface RegisterResponse {
  status: number;
  bodyStatus?: string;
  success?: boolean;
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
  token?: string;
  message?: string;
  error?: string;
}

export interface MeResponse {
  status: number;
  bodyStatus?: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
  message?: string;
  error?: string;
}

export async function register(
  full_name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  console.log('[REGISTER] Request başladı', { email, full_name });

  try {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, password }),
    }) as RegisterResponse;

    console.log('[REGISTER] Response geldi', response);

    // Accept when API indicates success or returns 200/201
    const okStatus = response.status === 200 || response.status === 201;
    const explicitSuccess = response.success === true;

    if (!explicitSuccess && !okStatus) {
      throw new Error(response.error || response.message || 'Kayıt başarısız');
    }

    return response;
  } catch (error) {
    console.error('[REGISTER] HATA oluştu', error);
    throw error;
  } finally {
    console.log('[REGISTER] Request bitti');
  }
}

export async function getCurrentUser(token: string): Promise<MeResponse> {
  console.log('[ME] Request başladı');

  try {
    const response = await apiRequest('/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as MeResponse;

    console.log('[ME] Response geldi', response);

    // Accept when API indicates success or returns 200
    const okStatus = response.status === 200;
    const explicitSuccess = response.user != null;

    if (!explicitSuccess && !okStatus) {
      throw new Error(response.error || response.message || 'Kullanıcı bilgisi alınamadı');
    }

    return response;
  } catch (error) {
    console.error('[ME] HATA oluştu', error);
    throw error;
  } finally {
    console.log('[ME] Request bitti');
  }
}

export async function forgotPassword(email: string) {
  console.log('[FORGOT] Request başladı', { email });

  try {
    const response = await apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    console.log('[FORGOT] Response geldi', response);

    // Accept when API returns 200/201 or a success flag
    const statusOk = response && typeof response === 'object' && ('status' in response) && (response as any).status >= 200 && (response as any).status < 300;

    if (!statusOk) {
      throw new Error((response as any)?.message || 'Şifre sıfırlama isteği başarısız.');
    }

    return response;
  } catch (error) {
    console.error('[FORGOT] HATA oluştu', error);
    throw error;
  } finally {
    console.log('[FORGOT] Request bitti');
  }
}

