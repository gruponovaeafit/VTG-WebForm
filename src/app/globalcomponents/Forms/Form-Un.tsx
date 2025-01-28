"use client";
import { useRouter } from "next/navigation";

export default function UnForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      // Opcional: Enviar los datos a un endpoint
      const response = await fetch("/api/forms/un", {
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
        <label htmlFor="committies" className="block text-sm mb-2 text-blue-400">
        ¿Cuáles son tus comités de preferencia? 
        </label>
        <select
          id="comittie"
          name="committie"
          required
          className="w-full px-2 py-2 text-xs rounded border border-blue-400 bg-black text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[
            "Publicidad y Redes",
            "Gestión Humana",
            "Relaciones Públicas",
            "Logística y Mercadeo",
            "Académico"
          ].map((talks, index) => (
            <option key={index} value={talks}>
              {talks}
            </option>
          ))}
        </select>
      </div>
      
     <div className="mb-4">
        <label htmlFor="talks" className="block text-sm mb-2 text-blue-400">
          ¿Podrás asistir a la charla informativa del 31/01/2025 a las 3pm?
        </label>
        <select
          id="talk"
          name="talk"
          required
          className="w-full px-2 py-2 text-xs rounded border text-sm border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[
            "Sí, podré asistir",
            "No, nos vemos en el Assessment."
          ].map((talks, index) => (
            <option key={index} value={talks}>
              {talks}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="assessment" className="block text-sm mb-2 text-blue-400">Puedes asistir al assessment el 1 de Febrero</label>
        <select 
        name="assessment" 
        id="assessment"
        required
        className="w-full px-2 py-2 text-xs rounded border text-sm border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {["Sí",
            "No"
          ].map((assessment, index)=>(
            <option key={index} value={assessment}>{assessment}</option>
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
