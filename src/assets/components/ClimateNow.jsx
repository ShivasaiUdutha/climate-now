import React, { useState } from "react";

export default function ClimateNow() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ This function now supports ANY city using Open-Meteo Geocoding API
  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // Step 1: Get coordinates of the city
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("❌ City not found!");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Fetch weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        ...weatherData.current_weather,
        name,
        country,
      });
    } catch (err) {
      setError("⚠️ Failed to fetch weather data");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-600 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-white mb-6">🌦️ Climate Now</h1>

      {/* Search bar */}
      <div className="flex w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Enter city (e.g., Hyderabad)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-grow p-3 rounded-l-2xl outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-white text-blue-600 px-4 rounded-r-2xl font-semibold hover:bg-gray-200 transition"
        >
          Search
        </button>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-white">⏳ Loading...</p>}
      {error && <p className="text-red-200">{error}</p>}

      {/* Weather card */}
      {weather && (
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-xl font-bold mb-2">
            {weather.name}, {weather.country}
          </h2>
          <p className="text-gray-600">🌡️ Temp: {weather.temperature}°C</p>
          <p className="text-gray-600">💨 Wind: {weather.windspeed} km/h</p>
          <p className="text-gray-600">🧭 Direction: {weather.winddirection}°</p>
        </div>
      )}
    </div>
  );
}
