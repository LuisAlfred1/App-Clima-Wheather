import { useState } from "react";
import Lottie from "lottie-react";
import cityAnimation from "../assets/clima.json";

export const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Estado para manejar la carga
  const [isLoading, setIsLoading] = useState(false);

  const urlBase = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "bfaa726bc642969a81d49e80843e7e4c";

  // Función para actualizar el estado con el valor del input
  const handleChange = (e) => {
    setCity(e.target.value);
  };

  //Manejo del submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchClima();
  };

  //Fetch a la API del clima (a implementar)
  const fetchClima = async () => {
    // Validar que la ciudad no esté vacía
    if (!city.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${urlBase}?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );

      const result = await response.json();
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

  // Función para obtener los estilos según el clima
  const getWeatherStyles = () => {
    // Si no hay datos, retornar una clase por defecto
    if (!data) return "";

    // Obtener el estado del clima
    const main = data.weather[0].main;

    // Determinar si es de día o de noche
    const icon = data.weather[0].icon;

    // Los íconos que terminan con "n" son de noche
    const isNight = icon.includes("n");

    //Si es de noche, retornar estilos oscuros
    if (isNight)
      return "bg-linear-to-br from-slate-900 to-blue-900 text-white transition";

    // Retornar estilos según el estado del clima
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
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ingresa la ciudad, luego presiona enter"
              className="w-full px-5 py-3 rounded-2xl bg-white/40 backdrop-blur-md placeholder:text-black/50 outline-none transition"
              value={city}
              onChange={handleChange}
            />
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
        <div className="bg-red-500/20 text-red-500 px-4 py-2 rounded-lg">
          ❌ {error}
        </div>
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
        <div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center w-full max-w-5xl sm:mx-0 mx-auto mt-4">
            <div className="p-6 bg-white/25 backdrop-blur-lg rounded-2xl shadow-md flex flex-col">
              <p className="text-md opacity-80">Humedad</p>
              <p className="text-4xl font-medium">{data?.main.humidity} %</p>
            </div>
            <div className="p-6 bg-white/25 backdrop-blur-lg rounded-2xl shadow-md flex flex-col">
              <p className="text-md opacity-80">Descripción</p>
              <p className="text-4xl font-medium">
                {data?.weather?.[0]?.description}
              </p>
            </div>
            <div className="p-6 bg-white/25 backdrop-blur-lg rounded-2xl shadow-md flex flex-col">
              <p className="text-md opacity-80">Viento</p>
              <p className="text-4xl font-medium">{data?.wind?.speed} m/s</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
