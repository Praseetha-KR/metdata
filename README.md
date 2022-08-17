# MetData

Cloudflare worker to get the realtime meteorological data

Created using: [OpenWeather API](https://openweathermap.org/api)

### Usage

```
/?lat=12.9814&lon=77.5974
```
or

```
/?location=bangalore
```

#### Output

> 🌤 Clouds (few clouds) 25°C, Feels like 25°C, Humidity 61%, Wind 3.09 m/s from W, AQI 1 (good)
> Location: Bengaluru (12.9814, 77.5974), Visibility 6.0 km, Pressure 1015 millibar, Sun rises at 6:07 AM and sets at 6:40 PM

### Build

#### Local dev server

```
npm run start
```
#### Deploy

```
npm run deploy
```
