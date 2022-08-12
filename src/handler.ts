declare global {
  const API_KEY: string;
}

interface Coordinates {
  latitude: string;
  longitude: string;
}

interface WeatherContext {
  icon: string;
  statusTitle: string;
  statusDescription: string;
  temp: number;
  feelsLikeTemp: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
}

const iconMap: { [key: string]: string } = {
  "01d": "☀️",
  "01n": "☀️",
  "02d": "🌤",
  "02n": "🌤",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "⛅️",
  "04n": "⛅️",
  "09d": "🌧",
  "09n": "🌧",
  "10d": "🌦",
  "10n": "🌦",
  "11d": "🌩",
  "11n": "🌩",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌨",
  "50n": "🌨",
};

function windAngleToDirection(deg: number): string {
  if (deg >= 337.5 || deg < 22.5) {
    return "N";
  }
  if (deg >= 22.5 && deg < 67.5) {
    return "NE";
  }
  if (deg >= 67.5 && deg < 112.5) {
    return "E";
  }
  if (deg >= 112.5 && deg < 157.5) {
    return "SE";
  }
  if (deg >= 157.5 && deg < 202.5) {
    return "S";
  }
  if (deg >= 202.5 && deg < 247.5) {
    return "SW";
  }
  if (deg >= 247.5 && deg < 292.5) {
    return "W";
  }
  if (deg >= 292.5 && deg < 337.5) {
    return "NW";
  }
  return "";
}

function getWeatherText(ctx: WeatherContext): string {
  return [
    `${ctx.icon} `,
    `${ctx.statusTitle} (${ctx.statusDescription}) `,
    `${ctx.temp}°C, Feels like ${ctx.feelsLikeTemp}°C, `,
    `Humidity ${ctx.humidity}%, `,
    `Wind ${ctx.windSpeed}km/h from ${ctx.windDirection}`,
  ].join("");
}

async function getWeather(
  lat: string,
  lon: string
): Promise<WeatherContext | null> {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);

  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    let res: any = await response.json();
    return {
      icon: iconMap[res.weather[0].icon],
      statusTitle: res.weather[0].main,
      statusDescription: res.weather[0].description,
      temp: res.main.temp,
      feelsLikeTemp: res.main.feels_like,
      humidity: res.main.humidity,
      windSpeed: res.wind.speed,
      windDirection: windAngleToDirection(res.wind.deg),
    };
  }
  return null;
}

async function getCoordinates(location: string): Promise<Coordinates> {
  const url: string = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${API_KEY}`;
  const response: Response = await fetch(url);
  const results: any = await response.json();
  return {
    latitude: results?.[0]?.lat ?? "0.0",
    longitude: results?.[0]?.lon ?? "0.0",
  };
}

export async function handler(request: Request) {
  let params: URLSearchParams = new URL(request.url).searchParams;

  let latitude: string = params.get("lat") || "0.0";
  let longitude: string = params.get("lon") || "0.0";

  const location: string = params.get("location") || "";
  if (location) {
    ({ latitude, longitude } = await getCoordinates(location));
  }

  let weatherText: string = "";
  const weather: WeatherContext | null = await getWeather(latitude, longitude);
  if (weather) {
    weatherText = getWeatherText(weather);
  }

  const html: string = `<!DOCTYPE html><body><div>${weatherText}</div></body>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });
}
