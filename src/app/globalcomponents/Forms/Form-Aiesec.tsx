"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AiesecForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/aiesec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.notification?.message || "Error en el servidor.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      toast.success(result.notification?.message || "Formulario enviado con éxito.", {
        position: "top-center",
        autoClose: 3000,
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
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <form
        onSubmit={handleFormSubmit}
        className="bg-gray-800 bg-opacity-90 p-4 sm:p-6 rounded-lg shadow-lg w-full"
      >
        <label htmlFor="talk" className="block text-sm mb-2 text-blue-400">Ingresa tu telefono</label>
        <input className="w-full px-4 py-2 text-sm rounded border border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" placeholder="Telefono" />
        <button
          type="submit"
          className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300 text-sm sm:text-base transform hover:scale-105 active:scale-95"
        >
          Level Up!
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}