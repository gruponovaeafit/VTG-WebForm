"use client";

import { useRouter } from "next/navigation";

export default function TvuForm() {
      const router = useRouter();

      const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formElement = e.currentTarget;
        const formData = new FormData(formElement);

        try {
          // Opcional: Enviar los datos a un endpoint
          const response = await fetch("/api/forms/tvu", {
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
        <label htmlFor="talks" className="block text-m mb-2 text-purple-400">
          ¿A qué charla informativa deseas asistir? 
        </label>
        <select
          id="talk"
          name="talk"
          required
          className="w-full px-2 py-2 text-sm rounded border border-purple-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {[
            "Charla 1: Jueves 30 de Enero 6pm-7pm",
            "Charla 2: Viernes 31 de Enero 4pm-5pm",
            "Charla 3: Miércoles 5 de Febrero 6pm-7pm",
          ].map((talks, index) => (
            <option key={index} value={talks}>
              {talks}
            </option>
          ))}
        </select>
      </div>


      <button
        type="submit"
        className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
      >
        Level Up!
      </button>
    </form>
  );
}
