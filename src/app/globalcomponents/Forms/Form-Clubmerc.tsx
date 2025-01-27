"use client";

import { useRouter } from "next/navigation";

export default function ClubmercForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      // Opcional: Enviar los datos a un endpoint
      const response = await fetch("/api/forms/clubmerc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())), // Convierte FormData a JSON
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      // Redirigir al usuario a /completed
      router.push("/levelup");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
    >
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm mb-2 text-blue-400">
          Comités
        </label>
        <select 
        name="committieSelect" 
        id="committieSelect"
        required
        className="w-full px-4 py-2 text-sm rounded border border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {["Relaciones Públicas",
            "Publicidad y Mercadeo",
            "Conexión Estratégica",
            "Gestión Humana",
          ].map((committie, index)=>(
            <option key={index} value={committie}>{committie}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="secondName" className="block text-sm mb-2 text-blue-400">
        ¿Tienes disponibilidad este Sábado 03 de Agosto de 7am - 1pm
        </label>
        <select 
        name="committieSelect" 
        id="committieSelect"
        required
        className="w-full px-4 py-2 text-sm rounded border border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {["Sí",
            "No",
          ].map((response, index)=>(
            <option key={index} value={response}>{response}</option>
          ))}
        </select>
      </div>



      <button
        type="submit"
        className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-400 font-bold uppercase tracking-wider transition duration-300"
      >
        ¡Enviar!
      </button>
    </form>
  );
}
