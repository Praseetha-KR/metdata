import { OpenWeatherMap, OpenWeather } from "./open-weather-map";

export async function handler(request: Request) {
  const params: URLSearchParams = new URL(request.url).searchParams;
  const lat: string = params.get("lat") || "0.0";
  const lon: string = params.get("lon") || "0.0";
  const location: string = params.get("location") || "";

  const api: OpenWeatherMap = location
    ? await OpenWeatherMap.fromLocation(location)
    : new OpenWeatherMap(lat, lon);

  const w: OpenWeather | null = await api.fetchWeather();
  let status: string = "";
  if (w) {
    status = [
      `${w.icon} `,
      `${w.statusTitle} (${w.statusDescription}) `,
      `${w.tempDisplay}, `,
      `Feels like ${w.feelsLikeTempDisplay}, `,
      `Humidity ${w.humidityDisplay}, `,
      `Wind ${w.windSpeedDisplay} from ${w.windDirection}, `,
      `AQI ${w.aqiDisplay}`,
      `<br>`,
      `Location: ${w.area} (${w.latitude}, ${w.longitude}), `,
      `Visibility ${w.visibilityDisplay}, Pressure ${w.pressureDisplay}, `,
      `Sun raises at ${w.sunriseTimeDisplay} and sets at ${w.sunsetTimeDisplay}`,
    ].join("");
  }

  const html: string = `<!DOCTYPE html><body><div>${status}</div></body>`;
  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });
}
