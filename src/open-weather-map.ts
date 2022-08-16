import { Weather } from "./weather";

declare global {
  const API_KEY: string;
}

export class OpenWeatherMap {
  ICON_CODE_MAP: { [key: string]: string } = {
    /* Ref: https://openweathermap.org/weather-conditions */
    "01": "☀️", // clear sky
    "02": "🌤", // few clouds
    "03": "☁️", // scattered clouds
    "04": "⛅️", // broken clouds
    "09": "🌧", // shower rain
    "10": "🌦", // rain
    "11": "🌩", // thunderstorm
    "13": "❄️", // snow
    "50": "🌨", // mist
  };

  AQI_MAP: { [key: string]: string } = {
    /* Ref: https://openweathermap.org/api/air-pollution#fields */
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor",
  };

  latitude: string;
  longitude: string;

  constructor(latitude: string, longitude: string) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static async fromLocation(location: string): Promise<OpenWeatherMap> {
    /* Ref: https://openweathermap.org/api/geocoding-api#direct */
    const geoLocationAPI: string = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`;
    const response: Response = await fetch(geoLocationAPI);
    const res: any = await response.json();
    const latitude = res?.[0]?.lat ?? "0.0";
    const longitude = res?.[0]?.lon ?? "0.0";
    return new OpenWeatherMap(latitude, longitude);
  }

  async fetchAirPollution() {
    /* Ref: https://openweathermap.org/api/air-pollution */
    const airPollutionAPI = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${this.latitude}&lon=${this.longitude}&appid=${API_KEY}`;
    const response: Response = await fetch(airPollutionAPI);
    const res: any = await response.json();
    console.log(res.coord, res.list);
    return res;
  }

  async fetchWeather(): Promise<Weather | null> {
    /* Ref: https://openweathermap.org/current */
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&units=metric&appid=${API_KEY}`;
    const response: Response = await fetch(weatherAPI);
    const res: any = await response.json();
    console.log(res);
    const airPollutionRes = await this.fetchAirPollution();
    return new Weather(
      this.getIcon(res.weather[0].icon),
      res.weather[0].main,
      res.weather[0].description,
      res.main.temp,
      res.main.feels_like,
      res.main.humidity,
      res.main.pressure,
      res.visibility,
      res.wind.speed,
      res.wind.deg,
      res.coord.lat,
      res.coord.lon,
      res.name,
      res.sys.sunrise,
      res.sys.sunset,
      airPollutionRes.list[0].main.aqi,
      this.getAQIDisplay(airPollutionRes.list[0].main.aqi)
    );
  }

  getIcon(code: string): string {
    return this.ICON_CODE_MAP[code.slice(0, -1)] || "";
  }
  getAQIDisplay(aqi: number): string {
    return this.AQI_MAP[aqi];
  }
}
