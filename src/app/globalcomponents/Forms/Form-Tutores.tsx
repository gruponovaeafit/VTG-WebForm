"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TutoresForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/tutores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
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
      toast.success("Formulario enviado con éxito", {
        position: "top-center",
        autoClose: 500,
        onClose: () => router.push("/gameover"),
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
        {
          position: "top-center",
          autoClose: 1500,
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
          <label
            htmlFor="IdTutor"
            className="block text-sm mb-2 text-[#513D9C]"
          >
            Nombre de la persona que te inscribió
          </label>
          <input
            type="text"
            id="IdTutor"
            name="IdTutor"
            required
            placeholder="Asesor"
            title="IdTutor"
            className="w-full px-4 py-2 rounded border border-[#9b9b9b] bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-white placeholder:opacity-70"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ig" className="block text-sm mb-2 text-[#513D9C]">
            Ingresa a <a href="https://www.instagram.com/tutoreseafit" target="_blank" className="text-white">@tutoreseafit</a> para consultar los horarios de nuestras charlas informativas
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
