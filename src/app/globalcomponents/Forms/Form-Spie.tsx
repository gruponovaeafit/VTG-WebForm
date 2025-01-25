"use client";

import { useRouter } from "next/navigation";

export default function SpieForm() {
  const router = useRouter();

      const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formElement = e.currentTarget;
        const formData = new FormData(formElement);

        try {
          // Opcional: Enviar los datos a un endpoint
          const response = await fetch("/api/forms/spie", {
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
        <label htmlFor="committie" className="block text-sm mb-2 text-red-600">
          ¿En que comité te gustaría participar?
        </label>
        <select 
        name="committie" 
        id="committie"
        required
        className="w-full px-4 py-2 text-sm rounded border border-red-600 bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600">
          {["Comité de Publicidad",
            "Comité de Divulgación",
            "Comité de RRPP",
            "Comité de GH",
          ].map((committie, index)=>(
            <option key={index} value={committie}>{committie}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="secondaryPrograms" className="block text-sm mb-2 text-red-600 ">
          ¿A que charla informativa puedes asistir? 
        </label>
        <select
          id="secondaryPrograms"
          name="secondaryPrograms"
          required
          className="w-full px-4 py-2 text-sm rounded border border-red-600 bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          {[
            "Charla 1",
            "Charla 2",
            "Charla 3",
            "Charla 4"
          ].map((program, index) => (
            <option key={index} value={program}>
              {program}
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
