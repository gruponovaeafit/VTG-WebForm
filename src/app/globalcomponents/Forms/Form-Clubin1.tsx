"use client";

import { useRouter } from "next/navigation";

export default function Clubin1Form() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      // Opcional: Enviar los datos a un endpoint
      const response = await fetch("/api/forms/clubin", {
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
      <label htmlFor="name" className="block text-sm mb-4 text-blue-200">
            Debes inscribirte en uno de nuestros pre-assessment, elige el horario que mejor te quede
        </label>
        <label htmlFor="name" className="block text-sm mb-2 text-blue-200">
          Días
        </label>
        <select 
        name="date" 
        id="date"
        required
        className="w-full px-2 py-2 text-sm rounded border border-blue-200 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {["Miercoles", "Jueves", "Viernes"].map((date, index) => (
            <option key={index} value={date}>
              {date}
            </option>
          ))}
        </select>
        
      </div>


      <div className="mb-4">
        <label htmlFor="talks" className="block text-sm mb-2 text-blue-200">
          Horas
        </label>
        <select
          id="talk"
          name="talk"
          required
          className="w-full px-2 py-2 text-sm rounded border border-blue-200 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[
            "10:00",  
            "10:10",  
            "10:20",  
            "10:30",  
            "10:40",  
            "10:50",  
            "11:00",  
            "11:10",  
            "11:20",  
            "11:30",  
            "11:40",  
            "11:50",  
            "13:00",  
            "13:10",  
            "13:20",  
            "13:30",  
            "13:40",  
            "13:50",  
            "14:00",  
            "14:10",  
            "14:20",  
            "14:30",  
            "14:40",  
            "14:50",  
            "15:00",  
            "15:10",  
            "15:20",  
            "15:30",  
            "15:40",  
            "15:50",  
            "16:00",  
            "16:10",  
            "16:20",  
            "16:30",  
            "16:40",  
            "16:50",
          ].map((talks, index) => (
            <option key={index} value={talks}>
              {talks}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="asesor" className="block text-sm mb-2 text-blue-200">
          Escribe el nombre de tu asesor
        </label>
        <input
          type="text"
          id="asesor"
          name="asesor"
          required
          className="w-full px-2 py-2 text-sm rounded border border-blue-200 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre"> 
          </input>
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
