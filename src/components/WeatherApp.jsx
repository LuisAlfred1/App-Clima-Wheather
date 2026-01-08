import { useState } from "react";

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
      return "bg-gradient-to-br from-slate-900 to-blue-900 text-white";

    // Retornar estilos según el estado del clima
    switch (main) {
      case "Clear":
        return "bg-gradient-to-br from-sky-300 to-orange-400 text-gray-900";

      case "Clouds":
        return "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900";

      case "Rain":
      case "Drizzle":
        return "bg-gradient-to-br from-blue-500 to-blue-700 text-white";

      case "Thunderstorm":
        return "bg-gradient-to-br from-gray-800 to-gray-900 text-white";

      case "Snow":
        return "bg-gradient-to-br from-blue-100 to-blue-200 text-gray-900";

      default:
        return "bg-gradient-to-br from-sky-400 to-sky-600 text-white";
    }
  };

  return (
    //Llamar la función getWeatherStyles para aplicar los estilos dinámicos en el contenedor principal
    <section
      className={`min-h-screen flex flex-col gap-6 items-center justify-start p-6 ${getWeatherStyles()}`}
    >
      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold">WeatherApp</h1>
        <form onSubmit={handleSubmit} className="max-w-lg w-full">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ingresa la ciudad..."
              className="w-full px-4 py-2 outline-none border-2 rounded-full backdrop-blur-md bg-white/10"
              value={city}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="flex justify-center min-h-50 items-center">
          Cargando...
        </div>
      )}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div>
        <img
          src={`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`}
          alt="logo"
          className="mx-auto"
        />
        <h2 className="text-4xl font-bold mb-2">Clima en {data?.name}</h2>
      </div>
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center w-full max-w-5xl sm:mx-0 mx-auto">
          <div className="max-w-sm p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-md flex flex-col">
            <p className="text-2xl">Temperatura:</p>
            <p className="text-4xl font-bold">{data?.main.temp} °C</p>
          </div>
          <div className="max-w-sm p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-md flex flex-col">
            <p className="text-2xl">Humedad:</p>
            <p className="text-4xl font-bold">{data?.main.humidity} %</p>
          </div>
          <div className="max-w-sm p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-md flex flex-col">
            <p className="text-2xl">Descripción:</p>
            <p className="text-4xl font-bold">
              {data?.weather?.[0]?.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
