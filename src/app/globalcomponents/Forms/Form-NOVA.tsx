"use client";

import { useRouter } from "next/navigation";

export default function NOVAForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      // Opcional: Enviar los datos a un endpoint
      const response = await fetch("/api/forms/nova", {
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
        <label htmlFor="talk" className="block text-sm mb-2 text-purple-600">
          ¿A qué charla informartiva asistirás?
        </label>
        <select
        id="talk"
        name="talk"
        required
        className="w-full px-4 py-2 text-sm rounded border border-purple-600 bg-black text-white focus:outline-none focus:ring-2 focus:ring-purple-600">
          {[
            "Lun. 3 feb, 2-3 p.m.",
            "Mié. 5 feb, 3-4 p.m.",
            "Vie. 7 feb, 1-2 p.m."
          ].map((group, index)=>(
            <option key={index} value={group}>{group}</option>
          ))}          
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="IdNovato" className="block text-sm mb-2 text-purple-600">
          Nombre de la persona que te inscribió
        </label>
        <input
          type="text"
          id="IdNovato"
          name="IdNovato"
          required
          placeholder="Nombre"
          title="IdNovato"
          className="w-full px-4 py-2 rounded border border-purple-600 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-purple-700 placeholder:opacity-70"
        />
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
