"use client";

import { useRouter } from "next/navigation";

export default function AcademicForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

     try {
      const response = await fetch("/api/forms/final", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())), // Convierte FormData a JSON
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      } 

      alert("Formulario enviado correctamente.");
      router.push("/Completed"); 
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

      <div className="mb-4">
        <label htmlFor="programs" className="block text-m mb-2 text-yellow-400">
          Programa académico
        </label>
        <select
          id="programs"
          name="programs"
          required
          className="w-full px-4 py-2 rounded border border-yellow-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {[
            "Administración de Negocios",
            "Biología",
            "Ciencias Políticas",
            "Comunicación Social",
            "Contaduría Pública",
            "Derecho",
            "Diseño Interactivo",
            "Diseño Urbano y Gestión del Hábitat",
            "Economía",
            "Finanzas",
            "Geología",
            "Ingeniería Agronómica",
            "Ingeniería Civil",
            "Ingeniería de Diseño de Producto",
            "Ingeniería Física",
            "Ingeniería Matemática",
            "Ingeniería Mecánica",
            "Ingeniería de Procesos",
            "Ingeniería de Producción",
            "Ingeniería de Sistemas",
            "Literatura",
            "Mercadeo",
            "Música",
            "Negocios Internacionales",
            "Psicología",
          ].map((program, index) => (
            <option key={index} value={program}>
              {program}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="secondaryPrograms" className="block text-m mb-2 text-yellow-400">
          Programa académico Secundario
        </label>
        <select
          id="secondaryPrograms"
          name="secondaryPrograms"
          required
          className="w-full px-4 py-2 rounded border border-yellow-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {[
            "No Aplica",
            "Administración de Negocios",
            "Biología",
            "Ciencias Políticas",
            "Comunicación Social",
            "Contaduría Pública",
            "Derecho",
            "Diseño Interactivo",
            "Diseño Urbano y Gestión del Hábitat",
            "Economía",
            "Finanzas",
            "Geología",
            "Ingeniería Agronómica",
            "Ingeniería Civil",
            "Ingeniería de Diseño de Producto",
            "Ingeniería Física",
            "Ingeniería Matemática",
            "Ingeniería Mecánica",
            "Ingeniería de Procesos",
            "Ingeniería de Producción",
            "Ingeniería de Sistemas",
            "Literatura",
            "Mercadeo",
            "Música",
            "Negocios Internacionales",
            "Psicología",
          ].map((program, index) => (
            <option key={index} value={program}>
              {program}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="semester" className="block text-m mb-2 text-purple-400">
          ¿En qué semestre te encuentras?
        </label>
        <select
          id="semester"
          name="semester"
          required
          className="w-full px-4 py-2 rounded border border-purple-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="studentGroup" className="block text-m mb-2 text-teal-400">
          Grupo estudiantil de interés
        </label>
        <select
          id="studentGroup"
          name="studentGroup"
          required
          className="w-full px-4 py-2 rounded border border-teal-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {[
            "AIESEC",
            "CLUBIN",
            "CLUBMERC",
            "GPG",
            "NEXOS",
            "NOVA",
            "PARTNERS",
            "SERES",
            "SPIE",
            "TUTORES",
            "TVU",
            "UN SOCIETY",
          ].map((group, index) => (
            <option key={index} value={group}>
              {group}
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
