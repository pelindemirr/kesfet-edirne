type LiveWeatherResult = {
  temperatureC: number;
  description: string;
};

type LiveCurrencyResult = {
  usdTry: number;
};

const DEFAULT_WEATHER: LiveWeatherResult = {
  temperatureC: 22,
  description: 'Açık',
};

const DEFAULT_CURRENCY: LiveCurrencyResult = {
  usdTry: 32,
};

function weatherCodeToDescription(code: number) {
  if (code === 0) return 'Açık';
  if (code === 1 || code === 2) return 'Az bulutlu';
  if (code === 3) return 'Parçalı bulutlu';
  if (code >= 45 && code <= 48) return 'Sisli';
  if (code >= 51 && code <= 67) return 'Yağmurlu';
  if (code >= 71 && code <= 77) return 'Karlı';
  if (code >= 80 && code <= 82) return 'Sağanak';
  if (code >= 95) return 'Fırtınalı';
  return 'Güncel';
}

export async function fetchLiveWeather(): Promise<LiveWeatherResult> {
  try {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=41.6771&longitude=26.5557&current=temperature_2m,weather_code&timezone=Europe%2FIstanbul',
    );

    if (!response.ok) {
      return DEFAULT_WEATHER;
    }

    const data = await response.json();
    const temperatureC = Number(data?.current?.temperature_2m);
    const weatherCode = Number(data?.current?.weather_code);

    if (!Number.isFinite(temperatureC)) {
      return DEFAULT_WEATHER;
    }

    return {
      temperatureC,
      description: weatherCodeToDescription(Number.isFinite(weatherCode) ? weatherCode : 0),
    };
  } catch {
    return DEFAULT_WEATHER;
  }
}

export async function fetchUsdTryRate(): Promise<LiveCurrencyResult> {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');

    if (!response.ok) {
      return DEFAULT_CURRENCY;
    }

    const data = await response.json();
    const usdTry = Number(data?.rates?.TRY);

    if (!Number.isFinite(usdTry)) {
      return DEFAULT_CURRENCY;
    }

    return { usdTry };
  } catch {
    return DEFAULT_CURRENCY;
  }
}
