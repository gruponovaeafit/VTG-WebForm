"use client";

import { useRouter } from "next/navigation";

export default function NexosForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Recopilar los valores de los checkboxes seleccionados
    const departments = formElement.querySelectorAll('input[name="departments"]:checked');
    const departmentsArray = Array.from(departments).map((checkbox) => (checkbox as HTMLInputElement).value);

    // Convertir el array de departamentos a una cadena de texto separada por comas
    const departmentsString = departmentsArray.join(", ");

    // Agregar los departamentos al formData
    formData.append("departments", departmentsString);

    const formDataObject = Object.fromEntries(formData.entries());
    console.log("Datos del formulario:", formDataObject);

    try {
      const response = await fetch("/api/forms/nexos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      // Redirigir al usuario a /gameover
      router.push("/gameover");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-gray-800 bg-opacity-90 p-3 rounded-lg shadow-lg max-w-md w-full"
    >
      <div className="mb-4">
        <label htmlFor="Departments" className="block text-sm mb-2 text-[#9A975F]">
          Departamentos
        </label>
        <div className="flex flex-col space-y-2">
          {["Edición",
            "Desarrollo Humano",
            "Mercadeo",
            "Relaciones Públicas",
          ].map((department, index) => (
            <label key={index} className="inline-flex items-center">
              <input 
                type="checkbox"
                name="departments"
                value={department}
                className="form-checkbox text-[#9A975F] focus:ring-[#9A975F]" />
              <span className="ml-2 text-white">{department}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="assistance" className="block text-sm mb-2 text-[#9A975F]">
          ¿Asistirás a la charla informativa el viernes 26 de julio a las 2p.m.?
        </label>
        <select 
          name="assistance" 
          id="assistance"
          required
          className="w-full px-4 py-2 rounded border border-[#9A975F] bg-black text-white focus:outline-none focus:ring-2 focus:ring-[#9A975F]">
          {["Sí", "No"].map((response, index) => (
            <option key={index} value={response}>{response}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="Excuse" className="block text-sm mb-2 text-[#9A975F]">
          ¿Por qué no puedes asistir?
        </label>
        <input
          type="text"
          id="excuse"
          name="excuse"
          title="Excuse"
          className="w-full px-4 py-2 rounded border border-[#9A975F] bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-[#9A975F]-700 placeholder:opacity-70"
          placeholder="Ingresa tu excusa aquí"
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