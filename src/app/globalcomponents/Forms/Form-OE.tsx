"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OEForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const formDataObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/forms/oe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Error en el servidor.", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      toast.success(result.message || "Formulario enviado con éxito.", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => router.push("/gameover"),
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    }
  };

  return (
    <div>
      <form
        onSubmit={handleFormSubmit}
        className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full space-y-6"
      >
        <div className="mb-4">
          <label htmlFor="programs" className="block text-m mb-2 text-blue-400">
            ¿Puedes asistir a nuestra convocatoria para conocer más sobre el grupo?
          </label>
          <label htmlFor="programs" className="block text-m mb-2">
            Próximo viernes 31 de Enero a las 3pm
          </label>
          <select
            id="programs"
            name="programs"
            required
            className="w-full px-2 py-2 rounded border border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {["Si", "No"].map((program, index) => (
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
          Level Up!
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
