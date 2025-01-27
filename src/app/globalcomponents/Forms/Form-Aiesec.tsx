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
      const response = await fetch("/api/forms/aiesec", {
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
        <label htmlFor="Pregunta 1" className="block text-sm mb-2 text-blue-600 px-4">
          ¿A qué charla informativa puedes/deseas asistir?
        </label>
        <select
          name="talkSelection"
          id="talkSelection"
          required
          className="w-full px-4 py-2 rounded border border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-400" style={{ fontSize: '0.875rem' }}

        >
          {[
            "Charla #1/Día X Hora XX:XX",
            "Charla #2/Día X Hora XX:XX",
            "Charla #3/Día X Hora XX:XX",
          ].map((talk, index) => (
            <option key={index} value={talk}>
              {talk}
            </option>
          ))}
        </select>
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
