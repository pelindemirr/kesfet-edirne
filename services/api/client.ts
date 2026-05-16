// Merkezi API istemcisi

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || '';

type Json = Record<string, unknown>;

export async function apiRequest(path: string, options: RequestInit = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${BASE_URL}${normalizedPath}`;

  const mergedHeaders = {
    ...(options.headers || {}),
    'ngrok-skip-browser-warning': 'true',
  };

  console.log(`[API] ${options.method || 'GET'} ${url}`);
  if (options.body) {
    try {
      const body = JSON.parse(options.body as string);
      console.log('[API] Request body:', { ...body, password: body.password ? '***' : undefined });
    } catch (e) {
      console.log('[API] Request body:', options.body);
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: mergedHeaders,
    });

    let data: Json = {};
    try {
      data = (await response.json()) as Json;
    } catch {}

    // If the backend returns a `status` field in the JSON (e.g. "success"),
    // it would overwrite the numeric HTTP status when spreading. Preserve
    // the numeric HTTP status under `status` and move the body `status` to
    // `bodyStatus` so callers can inspect both.
    const bodyStatus = (data && Object.prototype.hasOwnProperty.call(data, 'status')) ? data.status : undefined;
    if (bodyStatus !== undefined) {
      // remove to avoid overwriting the numeric status when spreading
      // (we'll expose it separately as `bodyStatus`).
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (data as any).status;
    }

    console.log(`[API] Response ${response.status}:`, data, bodyStatus !== undefined ? { bodyStatus } : {});

    return {
      status: response.status,
      bodyStatus,
      ...data,
    };
  } catch (error) {
    console.error('[API] Network Error:', error);
    throw error;
  }
}
