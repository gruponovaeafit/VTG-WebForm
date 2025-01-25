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
        <label htmlFor="committies" className="block text-m mb-2 text-purple-400">
        ¿Cuáles son tus comités de preferencia? 
        </label>
        <select
          id="comittie"
          name="committie"
          required
          className="w-full px-2 py-2 rounded border border-purple-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {[
            "Publicidad y Redes: Responsables de la creación de contenido para redes sociales y del diseño de material gráfico.",
            "Gestión Humana: Gestores de las dinamicas sociales y el bienestar del grupo, enfocados en la construcción de un ambiente activo y sano.",
            "Relaciones Públicas: Encargados del desarrollo de fuertes vinculos de patrocinios, convenios y beneficios con aliados estrategicos.",
            "Logística y Mercadeo: Estrategia, contacto y coordinación para alcanzar metas. ",
            "Académico: Formadores de lideres, encargados de contacto de ponentes y montaje de eventos académicos."
          ].map((talks, index) => (
            <option key={index} value={talks}>
              {talks}
            </option>
          ))}
        </select>
      </div>
      
     <div className="mb-4">
        <label htmlFor="talks" className="block text-m mb-2 text-purple-400">
          ¿Podrás asistir a la charla informativa del X/X/XXXX a las X?
        </label>
        <select
          id="talk"
          name="talk"
          required
          className="w-full px-2 py-2 rounded border border-purple-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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

      <button
        type="submit"
        className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
      >
        ¡Enviar!
      </button>
    </form>
  );
}
