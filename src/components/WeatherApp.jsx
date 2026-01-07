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

  return (
    <section className="flex justify-center items-center p-8 flex-col gap-6">
      <h1 className="text-3xl font-bold">WeatherApp</h1>
      <form onSubmit={handleSubmit} className="max-w-md w-full">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ingresa la ciudad..."
            className="w-full px-3 py-2 outline-none border"
            value={city}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 transition cursor-pointer"
          >
            Buscar
          </button>
        </div>
      </form>
      {isLoading && <p>Cargando...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && (
        <div className="bg-gray-100  p-6 rounded-xl max-w-md w-full text-center border-2 border-gray-300">
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt="logo"
            className="mx-auto"
          />
          <h2 className="text-3xl font-bold mb-2">Clima en {data.name}</h2>
          <p className="text-xl font-bold">Temperatura: {data.main.temp} °C</p>
          <p className="text-gray-800">Humedad: {data.main.humidity} %</p>
          <p className="capitalize text-gray-700">
            Descripción: {data.weather[0].description}
          </p>
        </div>
      )}
    </section>
  );
};
