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
        <label htmlFor="name" className="block text-sm mb-2 text-purple-600">
          Departamentos
        </label>
        <select
        id="studentGroup"
        name="studentGroup"
        required
        className="w-full px-4 py-2 rounded border border-teal-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
          {[
            "MERCADEO",
            "COMMNUNITIES",
            "GESTIÓN HUMANA",
            "RELACIONES PÚBLICAS",
          ].map((group, index)=>(
            <option key={index} value={group}>{group}</option>
          ))}          
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="secondName" className="block text-sm mb-2 text-purple-600">
          Pregunta 2
        </label>
        <input
          type="text"
          id="secondName"
          name="secondName"
          required
          placeholder="Pregunta 2"
          title="Ingresa tus Apellidos"
          className="w-full px-4 py-2 rounded border border-purple-600 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-purple-700 placeholder:opacity-70"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm mb-2 text-purple-600">
          Pregunta 3
        </label>
        <input
          type="email"
          id="Pregunta 3"
          name="Pregunta 3"
          required
          placeholder="Pregunta 3"
          title="El correo debe ser institucional (@eafit.edu.co)."
          className="w-full px-4 py-2 rounded border border-purple-600 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-purple-700 placeholder:opacity-70"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="form" className="block text-sm mb-2 text-purple-600">
          Pregunta 4
        </label>
        <input 
        type="text"
        id="Pregunta 4"
        name="Pregunta 4"
        required
        placeholder="Pregunta 4"
        title="Obama"
        className="w-full px-4 py-2 rounded border border-purple-600 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-purple-700 placeholder:opacity-70"

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
