import { apiRequest } from './client';

export function fetchRoutes() {
  return apiRequest('/routes', {
    method: 'GET',
  });
}

export function fetchRouteDetail(id: string | number) {
  return apiRequest(`/routes/${id}`, {
    method: 'GET',
  });
}
