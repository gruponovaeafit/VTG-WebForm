"use client";

import { useRouter } from "next/navigation";

export default function PartnersForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      // Opcional: Enviar los datos a un endpoint
      const response = await fetch("/api/forms/partners", {
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
        <label htmlFor="name" className="block text-sm mb-2 text-orange-600">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Pepito"
          title="Ingresa tu Nombre"
          className="w-full px-4 py-2 rounded border border-orange-600 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-orange-700 placeholder:opacity-70"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="secondName" className="block text-sm mb-2 text-orange-600">
          Apellidos
        </label>
        <input
          type="text"
          id="secondName"
          name="secondName"
          required
          placeholder="Perez"
          title="Ingresa tus Apellidos"
          className="w-full px-4 py-2 rounded border border-orange-600 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-orange-700 placeholder:opacity-70"
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
