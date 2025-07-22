"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AssessmentForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Recolectar los datos del formulario
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      // Enviar la petición al endpoint /api/Data-AssessmentInfo (SIN captcha)
      const response = await fetch("/api/Data-AssessmentInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...Object.fromEntries(formData.entries()),
        }),
      });

      const result = await response.json();

      // Manejo de errores en la respuesta del servidor
      if (!response.ok) {
        if (result.notification) {
          toast.error(result.notification.message, {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Ocurrió un error al enviar el formulario.", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        return;
      }

      // Si todo fue exitoso
      toast.success(result.notification.message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          // Redirigir después de que se cierre la notificación
          if (result.redirectUrl) {
            router.push(result.redirectUrl);
          } else {
            // Por si no llega redirectUrl, ir a home o la ruta que prefieras
            router.push("/home");
          }
        },
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Error interno al enviar el formulario.", {
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
    <div className="relative">
      <form
        onSubmit={handleFormSubmit}
        className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        {/* Campo 1: Restricciones o preferencias alimentarias */}
        <div className="mb-4">
          <label htmlFor="foodRestrictions" className="block text-xs mb-2 text-white">
            ¿Cuentas con alguna preferencia o restricción en tu alimentación?
          </label>
          <label className="block text-xs mb-2 text-purple-400">
            (Puedes poner N/A)
          </label>
          <input
            type="text"
            id="foodRestrictions"
            name="foodRestrictions"
            required
            placeholder="Cuéntanos acá"
            className="w-full px-4 py-2 rounded border border-purple-600 bg-black text-white text-sm 
                       placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-purple-700 
                       placeholder:opacity-70"
          />
        </div>

        {/* Campo 2: Consideraciones de salud o movilidad */}
        <div className="mb-4">
          <label htmlFor="healthConsiderations" className="block text-xs mb-2 text-white">
            ¿Existe alguna consideración de salud o movilidad que te gustaría compartir para garantizar 
            tu comodidad y seguridad durante las actividades?
          </label>
          <label className="block text-xs mb-2 text-purple-400">
            (Puedes poner N/A)
          </label>
          <input
            type="text"
            id="healthConsiderations"
            name="healthConsiderations"
            required
            placeholder="Cuéntanos acá"
            className="w-full px-4 py-2 rounded border border-purple-600 bg-black text-white text-sm 
                       placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-purple-700 
                       placeholder:opacity-70"
          />
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 
                     active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300 mt-4"
        >
          Level Up!
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
