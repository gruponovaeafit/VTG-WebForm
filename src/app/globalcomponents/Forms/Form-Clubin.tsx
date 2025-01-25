"use client";

import { useRouter } from "next/navigation";

export default function AiesecForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      // Opcional: Enviar los datos a un endpoint
      const response = await fetch("/api/forms/clubin", {
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
        <label htmlFor="name" className="block text-sm mb-2 text-blue-200">
          ¿Qué edad tienes?
        </label>
        <input
          type="int"
          id="age"
          name="age"
          required
          placeholder="Edad"
          title="Ingresa tu edad"
          className="w-full px-4 py-2 rounded border border-blue-200 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:opacity-85"
        />
      </div>


      <div className="mb-4">
        <label htmlFor="talks" className="block text-m mb-2 text-blue-200">
          ¿Tienes disponibilidad los Viernes de 3pm a 5pm?
        </label>
        <select
          id="talk"
          name="talk"
          required
          className="w-full px-2 py-2 rounded border border-blue-200 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[
            "Si",
            "No"
          ].map((talks, index) => (
            <option key={index} value={talks}>
              {talks}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm mb-2 text-blue-200">
          ¿Quién te registró?
        </label>
        <input
          type="text"
          id="who"
          name="who"
          required
          placeholder="Nombre"
          title="Ingresa el nombre de quien te registró"
          className="w-full px-4 py-2 rounded border border-blue-200 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:opacity-85"
        />
      </div>


      <button
        type="submit"
        className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
      >
        ¡Enviar!
      </button>
    </form>
  );
}
