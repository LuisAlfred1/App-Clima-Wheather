import { useState } from "react";
import Lottie from "lottie-react";
import cityAnimation from "../assets/clima.json";

// Componente principal de la aplicación del clima
// Contiene estado, llamadas a la API y la UI para mostrar el clima
export const WeatherApp = () => {
  // Texto ingresado por el usuario (ej: "Madrid")
  const [city, setCity] = useState("");
  // Datos de la API de OpenWeather (objeto con main, weather, wind, etc.)
  const [data, setData] = useState(null);
  // Estado para manejar errores (mensajes amigables)
  const [error, setError] = useState(null);
  // Estado para mostrar un spinner mientras se cargan datos
  const [isLoading, setIsLoading] = useState(false);
  // Lista de sugerencias geocoding cuando el usuario escribe
  const [suggestions, setSuggestions] = useState([]);
  // Controla si se muestran las sugerencias debajo del input
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Configuración de la API
  const urlBase = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Actualiza el estado del input y busca sugerencias de ciudades
  const handleChange = (e) => {
    const value = e.target.value;
    setCity(value);
    // Buscar sugerencias solo cuando el usuario escribe
    fetchCities(value);
  };

  // Envío del formulario: previene recarga y consulta el clima por nombre
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchClima();
  };

  // Busca el clima usando coordenadas (usado al seleccionar una sugerencia)
  const fetchClimaByCoords = async (lat, lon) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${urlBase}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
      );

      const result = await response.json();
      setData(result);
    } catch (error) {
      setError("Error al obtener el clima");
    } finally {
      setIsLoading(false);
    }
  };

  // Llama a la API de geocoding para obtener sugerencias de ciudades
  const fetchCities = async (value) => {
    if (value.length < 2) {
      // Si el usuario escribió menos de 2 caracteres, no pedir sugerencias
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
      );

      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      // Errores de sugerencias no deben romper la app: solo loguear
      console.error("Error: ", error);
    }
  };

  // Busca el clima utilizando el nombre de la ciudad ingresada
  const fetchClima = async () => {
    // Evitar peticiones vacías
    if (!city.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${urlBase}?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );

      const result = await response.json();
      // Si la API responde con error, mostrar mensaje al usuario
      if (result.cod != 200) {
        setError(result.message);
        setData(null);
        setIsLoading(false);
        return;
      }
      setData(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los datos del clima:", error);
    }
  };

  // Cuando el usuario selecciona una ciudad de las sugerencias
  const handleSelectCity = (city) => {
    // Mostrar ciudad seleccionada en el input y limpiar sugerencias
    setCity(`${city.name}, ${city.country}`);
    setSuggestions([]);
    setShowSuggestions(false);
    // Obtener clima por coordenadas para mayor precisión
    fetchClimaByCoords(city.lat, city.lon);
  };

  // Determina clases CSS dinámicas según el clima y si es de día/noche
  const getWeatherStyles = () => {
    // Si no hay datos, retornar una clase vacía (estilo por defecto)
    if (!data) return "";

    // Estado principal del clima (Clear, Clouds, Rain, ...)
    const main = data.weather[0].main;

    const icon = data.weather[0].icon;
    const isNight = icon.includes("n");

    if (isNight)
      return "bg-linear-to-br from-slate-900 to-blue-900 text-white transition";

    switch (main) {
      case "Clear":
        return "bg-linear-to-br from-sky-300 to-orange-400 text-gray-900 transition";

      case "Clouds":
        return "bg-linear-to-br from-gray-300 to-gray-400 text-gray-900 transition";

      case "Rain":
      case "Drizzle":
        return "bg-linear-to-br from-blue-500 to-blue-700 text-white transition";

      case "Thunderstorm":
        return "bg-linear-to-br from-gray-800 to-gray-900 text-white transition";

      case "Snow":
        return "bg-linear-to-br from-blue-100 to-blue-200 text-gray-900 transition";

      default:
        return "bg-linear-to-br from-sky-200/60 via-blue-300/70 to-indigo-300/50 transition";
    }
  };

  return (
    //Llamar la función getWeatherStyles para aplicar los estilos dinámicos en el contenedor principal
    <section
      className={`min-h-screen flex flex-col gap-6 items-center justify-start p-6 ${getWeatherStyles()}`}
    >
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center w-full">
        <h1 className="text-2xl font-semibold tracking-tight">WeatherApp</h1>
        <form onSubmit={handleSubmit} className="max-w-lg w-full">
          <div className="flex gap-2 relative">
            <input
              type="text"
              placeholder="Ingresa la ciudad..."
              className="relative w-full px-5 py-3 rounded-2xl bg-white/40 backdrop-blur-md placeholder:text-black/60 outline-none transition"
              value={city}
              onChange={handleChange}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white/40 backdrop-blur-md rounded-xl shadow-lg mt-2 overflow-hidden z-50">
                {suggestions.map((city, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectCity(city)}
                    className="px-4 py-3 cursor-pointer hover:bg-white/20 transition"
                  >
                    {city.name}
                    {city.state && `, ${city.state}`} — {city.country}
                  </li>
                ))}
              </ul>
            )}
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/70 hover:text-gray-800 cursor-pointer transition"
            >
              <i className="bi bi-search text-l"></i>
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="flex flex-col items-center gap-2 mt-10">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p>Cargando clima...</p>
        </div>
      )}
      {error && (
        <section className="items-center flex min-h-100 text-red-500 px-4 py-2 rounded-lg text-xl">
          <div className="flex flex-col items-center">
            <img
              src="./src/assets/error-icon.jpg"
              alt="logoError"
              className="w-24 h-24"
            />
            {error}
          </div>
        </section>
      )}

      {!data && !isLoading && !error && (
        <div className="flex flex-col items-center text-center gap-4 animate-fade-in">
          <Lottie
            animationData={cityAnimation}
            loop
            className="w-54 h-54 opacity-90"
          />

          <p className="text-4xl font-medium tracking-tight">
            Busca una ciudad
          </p>

          <p className="text-md opacity-70 max-w-sm">
            Descubre el clima actual en cualquier lugar del mundo
          </p>

          <p className="text-sm opacity-60">
            Ejemplo: Guatemala, Madrid, Bogotá
          </p>
        </div>
      )}

      {data && (
        <div className="w-full flex flex-col items-center">
          <div className="flex flex-col items-center text-center gap-1">
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              className="w-20 h-20"
            />
            <p className="text-7xl font-light">{Math.round(data.main.temp)}°</p>
            <p className="text-lg opacity-80">
              {data.weather[0].description.charAt(0).toUpperCase() +
                data.weather[0].description.slice(1)}
            </p>
            <p className="text-sm opacity-70">{data.name}</p>
          </div>
          <div className="w-full px-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
              <div className="p-8 bg-white/25 backdrop-blur-lg rounded-2xl shadow-md flex flex-col">
                <p className="text-md opacity-80">
                  <i className="bi bi-droplet-half"></i> Humedad
                </p>
                <p className="text-4xl font-medium">{data?.main.humidity} %</p>
              </div>
              <div className="p-8 bg-white/25 backdrop-blur-lg rounded-2xl shadow-md flex flex-col">
                <p className="text-md opacity-80">
                  <i className="bi bi-info-circle"></i> Descripción
                </p>
                <p className="text-4xl font-medium">
                  {data?.weather?.[0]?.description}
                </p>
              </div>
              <div className="p-8 bg-white/25 backdrop-blur-lg rounded-2xl shadow-md flex flex-col">
                <p className="text-md opacity-80">
                  <i className="bi bi-send"></i> Viento
                </p>
                <p className="text-4xl font-medium">{data?.wind?.speed} m/s</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
