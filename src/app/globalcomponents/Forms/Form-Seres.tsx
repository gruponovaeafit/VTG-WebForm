"use client";

import { useRouter } from "next/navigation";

export default function SeresForm() {
  const router = useRouter();

      const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formElement = e.currentTarget;
        const formData = new FormData(formElement);

        try {
          // Opcional: Enviar los datos a un endpoint
          const response = await fetch("/api/forms/seres", {
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
          router.push("/gameover");
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
        <label htmlFor="talks" className="block text-sm mb-2 text-blue-200">
          ¿A qué charla informativa deseas asistir? 
        </label>
        <select
          id="talk"
          name="talk"
          required
          className="w-full px-2 py-2 text-sm rounded border border-blue-200 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[
            "Vie. 2 feb, 8-9 a.m.",
            "Vie. 2 feb, 10-11 a.m.",  
            "Vie. 2 feb, 12-1 p.m.",  
            "Vie. 2 feb, 3-4 p.m."
          ].map((talks, index) => (
            <option key={index} value={talks}>
              {talks}
            </option>
          ))}
        </select>
      </div>


      <button
        type="submit"
        className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-200 font-bold uppercase tracking-wider transition duration-300"
      >
        Level Up!
      </button>
    </form>
  );
}
