type WeatherResult = {
  temperatureC: number | null;
  description: string;
};

type CurrencyResult = {
  usdTry: number | null;
};

const DEFAULT_CITY = process.env.EXPO_PUBLIC_WEATHER_CITY ?? 'Edirne';
const DEFAULT_LAT = Number(process.env.EXPO_PUBLIC_WEATHER_LAT ?? '41.6771');
const DEFAULT_LON = Number(process.env.EXPO_PUBLIC_WEATHER_LON ?? '26.5557');

function weatherCodeToText(code: number): string {
  if (code === 0) return 'Açık';
  if ([1, 2, 3].includes(code)) return 'Parçalı bulutlu';
  if ([45, 48].includes(code)) return 'Sisli';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Çiseli';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Yağmurlu';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Karlı';
  if ([95, 96, 99].includes(code)) return 'Fırtınalı';
  return 'Güncel';
}

async function fetchWeatherByCity(): Promise<WeatherResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenWeather key missing');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(DEFAULT_CITY)}&units=metric&lang=tr&appid=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('OpenWeather request failed');
  }

  const data = await response.json();
  return {
    temperatureC: typeof data?.main?.temp === 'number' ? data.main.temp : null,
    description: data?.weather?.[0]?.description ?? 'Güncel',
  };
}

async function fetchWeatherByCoordinates(): Promise<WeatherResult> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${DEFAULT_LAT}&longitude=${DEFAULT_LON}&current_weather=true`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Open-Meteo request failed');
  }

  const data = await response.json();
  const temp = data?.current_weather?.temperature;
  const weatherCode = data?.current_weather?.weathercode;

  return {
    temperatureC: typeof temp === 'number' ? temp : null,
    description: typeof weatherCode === 'number' ? weatherCodeToText(weatherCode) : 'Güncel',
  };
}

export async function fetchLiveWeather(): Promise<WeatherResult> {
  try {
    return await fetchWeatherByCity();
  } catch {
    return fetchWeatherByCoordinates();
  }
}

export async function fetchUsdTryRate(): Promise<CurrencyResult> {
  const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY');

  if (!response.ok) {
    throw new Error('Frankfurter request failed');
  }

  const data = await response.json();
  const rate = data?.rates?.TRY;

  return {
    usdTry: typeof rate === 'number' ? rate : null,
  };
}
