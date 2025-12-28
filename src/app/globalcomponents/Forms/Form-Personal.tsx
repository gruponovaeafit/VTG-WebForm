"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
export default function AcademicForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/Data-Personal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/");
        }

        const result = await response.json();

        // Manejo de errores en la respuesta del servidor
        toast.error(result.message || "Error en el servidor", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      const result = await response.json();

      // Si todo está bien desde el servidor, muestra un toast de éxito y redirige a /academic
      toast.success(result.message || "Información guardada con éxito.", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => router.push("/academic"),
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
    <>
      <FormContainer onSubmit={handleFormSubmit} overlayClassName="bg-gray-800 bg-opacity-90 p-3 rounded-lg shadow-lg max-w-md w-full" formClassName="space-y-4" buttons={[
        <button type="submit" className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300 text-sm sm:text-base transform hover:scale-105 active:scale-95">
          Level Up!
        </button>
      ]}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm mb-2 text-pink-400">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Pepitx"
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
      </FormContainer>
      <ToastContainer />
    </>
  );
}
