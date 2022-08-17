export class AirPollution {
  aqi: number;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;

  constructor(
    aqi: number,
    co: number,
    no: number,
    no2: number,
    o3: number,
    so2: number,
    pm2_5: number,
    pm10: number,
    nh3: number
  ) {
    this.aqi = aqi;
    this.co = co;
    this.no = no;
    this.no2 = no2;
    this.o3 = o3;
    this.so2 = so2;
    this.pm2_5 = pm2_5;
    this.pm10 = pm10;
    this.nh3 = nh3;
  }
}

export class Weather {
  iconCode: string;
  statusTitle: string;
  statusDescription: string;
  temp: number;
  feelsLikeTemp: number;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  windAngle: number;
  latitude: string;
  longitude: string;
  area: string;
  sunrise: number;
  sunset: number;
  aqi: AirPollution;
  requestTimezone: string;

  constructor(
    iconCode: string,
    statusTitle: string,
    statusDescription: string,
    temp: number,
    feelsLikeTemp: number,
    humidity: number,
    pressure: number,
    visibility: number,
    windSpeed: number,
    windAngle: number,
    latitude: string,
    longitude: string,
    area: string,
    sunrise: number,
    sunset: number,
    aqi: AirPollution,
    requestTimezone: string
  ) {
    this.iconCode = iconCode;
    this.statusTitle = statusTitle;
    this.statusDescription = statusDescription;
    this.temp = temp;
    this.feelsLikeTemp = feelsLikeTemp;
    this.humidity = humidity;
    this.pressure = pressure;
    this.visibility = visibility;
    this.windSpeed = windSpeed;
    this.windAngle = windAngle;
    this.latitude = latitude;
    this.longitude = longitude;
    this.area = area;
    this.sunrise = sunrise;
    this.sunset = sunset;
    this.aqi = aqi;
    this.requestTimezone = requestTimezone;
  }

  get icon(): string {
    throw new Error("Method not implemented.");
  }
  get tempDisplay(): string {
    return this.celsiusDisplay(this.temp);
  }
  get feelsLikeTempDisplay(): string {
    return this.celsiusDisplay(this.feelsLikeTemp);
  }
  get humidityDisplay(): string {
    return `${this.humidity}%`;
  }
  get pressureDisplay(): string {
    return `${this.pressure} millibar`;
  }
  get visibilityDisplay(): string {
    return `${(this.visibility / 1000).toFixed(1)} km`;
  }
  get windSpeedDisplay(): string {
    return `${this.windSpeed} m/s`;
  }
  get windDirection(): string {
    return this.angleToDirection(this.windAngle);
  }
  get sunriseTimeDisplay(): string {
    return this.epochToTimeDisplay(this.sunrise);
  }
  get sunsetTimeDisplay(): string {
    return this.epochToTimeDisplay(this.sunset);
  }
  get aqiDisplay(): string {
    return `${this.aqi}`;
  }

  celsiusDisplay(temp: number): string {
    return `${Math.round(temp)}°C`;
  }

  epochToTimeDisplay(epoch: number) {
    const d = new Date(epoch * 1000);
    return new Intl.DateTimeFormat("default", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      timeZone: this.requestTimezone,
    }).format(d);
  }

  angleToDirection(deg: number): string {
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
}
