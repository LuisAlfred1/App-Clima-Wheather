import { useState } from "react";

export const WheatherApp = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);

  const urlBase = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "bfaa726bc642969a81d49e80843e7e4c";

  // Función para actualizar el estado con el valor del input
  const handleValue = (e) => {
    setCity(e.target.value);
  };

  //Manejo del submit del formulario
  const handleSumbit = (e) => {
    e.preventDefault();
    fetchClima();
  };

  //Fetch a la API del clima (a implementar)
  const fetchClima = async () => {
    try {
      const response = await fetch(
        `${urlBase}?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error al obtener los datos del clima:", error);
    }
  };

  return (
    <section className="flex justify-center items-center p-8 flex-col gap-6">
      <h1 className="text-2xl font-bold">WheatherApp</h1>
      <form onSubmit={handleSumbit} className="max-w-md w-full">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ingresa la ciudad..."
            className="w-full px-3 py-2 outline-none border"
            value={city}
            onChange={handleValue}
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 transition cursor-pointer"
          >
            Buscar
          </button>
        </div>
      </form>
      {data && (
        <div className="bg-gray-200 p-4 rounded-md max-w-md w-full">
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt="logo"
            className="mx-auto"
          />
          <h2 className="text-xl font-semibold mb-2">Clima en {data.name}</h2>
          <p>Temperatura: {data.main.temp} °C</p>
          <p>Humedad: {data.main.humidity} %</p>
          <p>Descripción: {data.weather[0].description}</p>
        </div>
      )}
      {data && data.length === 0 && (
        <div className="flex justify-center min-h-screen">
          <p className="text-xl">Ciudad no encontrada. Intenta de nuevo.</p>
        </div>
      )}
    </section>
  );
};
