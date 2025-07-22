"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClubmercForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/clubmerc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())), // Convierte FormData a JSON
      });

      const result = await response.json();

      // Manejo de errores en la respuesta del servidor
      if (!response.ok) {
        const errorMessage = result.message || "Error en el servidor.";

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          onClose: () => {
            if (errorMessage === "Ya estás registrado en este grupo.") {
              router.push("/groupslist");
            }
          },
        });
        return;
      }
      
      // Si todo está bien desde el servidor, muestra un toast de éxito y redirige a /gameover
      toast.success(result.message || "Formulario enviado con éxito.", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => router.push("/gameover"), // Redirige tras la notificación
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleFormSubmit}
        className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="mb-4">
          <label htmlFor="committieSelect" className="block text-sm mb-2 text-blue-400">
            Comités
          </label>
          <select
            name="committieSelect"
            id="committieSelect"
            required
            className="w-full px-4 py-2 text-sm rounded border border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[
              "Relaciones Públicas",
              "Publicidad y Mercadeo",
              "Conexión Estratégica",
              "Gestión Humana",
            ].map((committie, index) => (
              <option key={index} value={committie}>
                {committie}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="talk" className="block text-sm mb-2 text-blue-400">
            ¿Tienes disponibilidad este Sábado 26 de Julio?
          </label>
          <select
            name="talk"
            id="talk"
            required
            className="w-full px-4 py-2 text-sm rounded border border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {["Sí", "No"].map((response, index) => (
              <option key={index} value={response}>
                {response}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-400 font-bold uppercase tracking-wider transition duration-300"
        >
          Level Up!
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
