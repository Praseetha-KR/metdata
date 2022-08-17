import { Weather, AirPollution } from "./weather";

declare global {
  const API_KEY: string;
}

export class OpenWeather extends Weather {
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

  get icon(): string {
    return this.ICON_CODE_MAP[this.iconCode.slice(0, -1)];
  }

  get aqiDisplay(): string {
    return `${this.aqi.aqi} (${this.AQI_MAP[this.aqi.aqi].toLowerCase()})`;
  }
}

export class OpenWeatherMap {
  latitude: string;
  longitude: string;
  requestTimezone: string;

  constructor(latitude: string, longitude: string, requestTimezone: string) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.requestTimezone = requestTimezone;
  }

  static async fromLocation(
    location: string,
    requestTimezone: string
  ): Promise<OpenWeatherMap> {
    /* Ref: https://openweathermap.org/api/geocoding-api#direct */
    const geoLocationAPI: string = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`;
    const response: Response = await fetch(geoLocationAPI);
    const res: any = await response.json();
    const latitude = res?.[0]?.lat ?? "0.0";
    const longitude = res?.[0]?.lon ?? "0.0";
    return new OpenWeatherMap(latitude, longitude, requestTimezone);
  }

  async fetchAirPollution() {
    /* Ref: https://openweathermap.org/api/air-pollution */
    const airPollutionAPI = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${this.latitude}&lon=${this.longitude}&appid=${API_KEY}`;
    const response: Response = await fetch(airPollutionAPI);
    const res: any = await response.json();
    return new AirPollution(
      res.list[0].main.aqi,
      res.list[0].components.co,
      res.list[0].components.no,
      res.list[0].components.no2,
      res.list[0].components.o3,
      res.list[0].components.so2,
      res.list[0].components.pm2_5,
      res.list[0].components.pm10,
      res.list[0].components.nh3
    );
  }

  async fetchWeather(): Promise<OpenWeather | null> {
    /* Ref: https://openweathermap.org/current */
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&units=metric&appid=${API_KEY}`;
    const response: Response = await fetch(weatherAPI);
    const res: any = await response.json();
    const airPollutionRes = await this.fetchAirPollution();
    return new OpenWeather(
      res.weather[0].icon,
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
      airPollutionRes,
      this.requestTimezone
    );
  }
}
