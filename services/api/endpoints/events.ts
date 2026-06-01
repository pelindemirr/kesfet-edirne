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

export type EventTiming = 'upcoming' | 'past';

const TURKISH_MONTHS: Record<string, number> = {
  ocak: 0,
  subat: 1,
  mart: 2,
  nisan: 3,
  mayis: 4,
  haziran: 5,
  temmuz: 6,
  agustos: 7,
  eylul: 8,
  ekim: 9,
  kasim: 10,
  aralik: 11,
};

function normalizeTurkishText(value: string) {
  return value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİI]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u');
}

function parseEventDateTime(dateText: string, timeText: string) {
  if (!dateText) {
    return null;
  }

  const normalizedDate = dateText.trim().replace(/\s+/g, ' ');
  const normalizedDateParts = normalizedDate
    .replace(/[./]/g, ' ')
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean);

  let year: number | null = null;
  let month: number | null = null;
  let day: number | null = null;

  if (/^\d{4}-\d{2}-\d{2}/.test(dateText)) {
    const [datePart] = dateText.split('T');
    const [isoYear, isoMonth, isoDay] = datePart.split('-').map(Number);
    if (Number.isFinite(isoYear) && Number.isFinite(isoMonth) && Number.isFinite(isoDay)) {
      year = isoYear;
      month = isoMonth - 1;
      day = isoDay;
    }
  }

  if (year == null || month == null || day == null) {
    const compactParts = normalizedDateParts.map((part) => normalizeTurkishText(part));

    if (compactParts.length >= 3) {
      const first = compactParts[0].split('-')[0];
      const second = compactParts[1];
      const third = compactParts[2];

      const firstNumber = Number(first);
      const secondNumber = Number(second);
      const thirdNumber = Number(third);

      if (Number.isFinite(firstNumber) && Number.isFinite(thirdNumber) && third.length === 4) {
        day = firstNumber;
        month = Number.isFinite(secondNumber)
          ? secondNumber - 1
          : TURKISH_MONTHS[second] ?? null;
        year = thirdNumber;
      } else if (Number.isFinite(firstNumber) && Number.isFinite(secondNumber) && Number.isFinite(thirdNumber)) {
        day = firstNumber;
        month = secondNumber - 1;
        year = thirdNumber;
      } else if (Number.isFinite(firstNumber) && TURKISH_MONTHS[second] != null && Number.isFinite(thirdNumber)) {
        day = firstNumber;
        month = TURKISH_MONTHS[second];
        year = thirdNumber;
      }
    }
  }

  if (year == null || month == null || day == null) {
    const fallback = Date.parse(dateText);
    if (!Number.isNaN(fallback)) {
      return new Date(fallback);
    }
    return null;
  }

  const parsedTime = timeText.match(/(\d{1,2}):(\d{2})/);
  const hours = parsedTime ? Number(parsedTime[1]) : 0;
  const minutes = parsedTime ? Number(parsedTime[2]) : 0;

  return new Date(year, month, day, hours, minutes, 0, 0);
}

export function getEventTiming(event: Pick<Event, 'date' | 'time'>): EventTiming {
  const eventDateTime = parseEventDateTime(event.date, event.time);

  if (!eventDateTime) {
    return 'upcoming';
  }

  return eventDateTime.getTime() < Date.now() ? 'past' : 'upcoming';
}

export function getEventTimingLabel(event: Pick<Event, 'date' | 'time'>) {
  return getEventTiming(event) === 'past' ? 'Geçmiş' : 'Yaklaşan';
}

const CATEGORY_LABELS: Record<string, string> = {
  kultur: 'Kültür',
  sanat: 'Sanat',
  gastronomi: 'Gastronomi',
  spor: 'Spor',
};

export function getCategoryLabel(category?: string | null) {
  if (!category) return 'Kategori';
  const key = category.toString().trim().toLowerCase().replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİI]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u');
  return CATEGORY_LABELS[key] ?? category;
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