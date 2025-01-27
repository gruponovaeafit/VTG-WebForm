"use client";

import { useRouter } from "next/navigation";

export default function AcademicForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

     try {
      const response = await fetch("/api/dataPersonal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())), // Convierte FormData a JSON
      });

      const NoCookieError = 401;
      if (!response.ok) {
        console.log(response)
       if(response.status == NoCookieError)
        {
          router.push("/"); 
        }

        throw new Error("Error en el servidor");
      } 

      alert("Formulario enviado correctamente.");
      router.push("/academic"); 
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg max-w-md"
    >

<div className="mb-4">
        <label htmlFor="name" className="block text-sm mb-2 text-pink-400">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Pepito"
          className="w-full px-4 py-2 rounded border border-pink-400 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:opacity-70"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="secondName" className="block text-sm mb-2 text-pink-400">
          Apellidos
        </label>
        <input
          type="text"
          id="secondName"
          name="secondName"
          required
          placeholder="Perez"
          className="w-full px-4 py-2 rounded border border-pink-400 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:opacity-70"
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
