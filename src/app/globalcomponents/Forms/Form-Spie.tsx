"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SpieForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/spie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = await response.json();

      // Manejo de errores en la respuesta del servidor
      if (!response.ok) {
        toast.error(result.message || "Error en el servidor", {
          position: "top-center",
          autoClose: 1500,
        });
        return;
      }

      // Si todo está bien desde el servidor, muestra un toast de éxito y redirige a /gameover
      toast.success("Formulario enviado con éxito", {
        position: "top-center",
        autoClose: 1500,
        onClose: () => router.push("/gameover"),
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
  };

  return (
    <div>
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
            className="w-full px-4 py-2 text-xs rounded border border-red-600 bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            {[
              "Comité de Publicidad",
              "Comité de Divulgación",
              "Comité de RRPP",
              "Comité de GH",
            ].map((committie, index) => (
              <option key={index} value={committie}>
                {committie}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="secondaryPrograms"
            className="block text-sm mb-2 text-red-600 "
          >
            ¿A que charla informativa puedes asistir?
          </label>
          <select
            id="secondaryPrograms"
            name="secondaryPrograms"
            required
            className="w-full px-4 py-2 text-sm rounded border border-red-600 bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
          >
            {[
              "Vie. 31 ene, 5-6 p.m.",
              "Lun. 3 feb, 1-2 p.m.",
              "Jue. 6 feb, 1-2 p.m.",
            ].map((program, index) => (
              <option key={index} value={program}>
                {program}
              </option>
            ))}
          </select>
          <label
            htmlFor="disclamer"
            className="block text-sm mb-2 text-white text-[10px]"
          >
            Los salones de las charlas serán avisadas en redes sociales{" "}
            <span className="block text-sm mb-2 text-red-600 text-[10px]">
              @capitulospieeafit
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
        >
          Level Up!
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
