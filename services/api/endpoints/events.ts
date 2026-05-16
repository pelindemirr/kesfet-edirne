import { apiRequest } from '../client';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string | null;
  category: string;
  created_at?: string;
}

interface ApiResponse<T> {
  status: number;
  data: T;
  count?: number;
}

function isEvent(value: unknown): value is Event {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Event>;

  return (
    typeof candidate.id === 'number' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.date === 'string' &&
    typeof candidate.time === 'string' &&
    typeof candidate.location === 'string' &&
    typeof candidate.category === 'string'
  );
}

function extractEvents(response: unknown) {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as ApiResponse<unknown>).data;

    if (Array.isArray(data)) {
      return data.filter(isEvent);
    }
  }

  return [];
}

export async function getAllEvents() {
  const response = await apiRequest('/api/events', {
    method: 'GET',
  });

  return extractEvents(response);
}

export async function getUpcomingEvents() {
  const response = await apiRequest('/api/events/upcoming', {
    method: 'GET',
  });

  return extractEvents(response);
}

export async function getPastEvents() {
  const response = await apiRequest('/api/events/past', {
    method: 'GET',
  });

  return extractEvents(response);
}

export async function getEventsByCategory(category: string) {
  const response = await apiRequest(`/api/events?category=${encodeURIComponent(category)}`, {
    method: 'GET',
  });

  return extractEvents(response);
}

export async function getEventById(id: number | string) {
  const response = await apiRequest(`/api/events/${id}`, {
    method: 'GET',
  });

  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as ApiResponse<unknown>).data;

    return isEvent(data) ? data : null;
  }

  return isEvent(response) ? response : null;
}

export async function searchEvents(searchQuery: string) {
  return getEventsByCategory(searchQuery);
}