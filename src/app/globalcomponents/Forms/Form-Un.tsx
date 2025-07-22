"use client";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UnForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/un", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.message) {
          toast.error(result.message, {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          toast.error("Error en el servidor", {
            position: "top-center",
            autoClose: 3000,
          });
        }
        return;
      }

      toast.success("Formulario enviado con éxito", {
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
        className="bg-gray-800 bg-opacity-90 p-2 rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="mb-2">
          <label htmlFor="committies" className="block text-sm mb-2 text-blue-400">
            ¿Cuáles son tus comités de preferencia?
          </label>
          <select
            id="committie"
            name="committie"
            required
            className="w-full px-2 py-2 text-xs rounded border border-blue-400 bg-black text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[
              "Publicidad y Redes",
              "Gestión Humana",
              "Relaciones Públicas",
              "Logística",
              "Académico",
            ].map((talks, index) => (
              <option key={index} value={talks}>
                {talks}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label htmlFor="talks" className="block text-sm mb-2 text-blue-400">
            ¿Podrás asistir a la charla informativa del Viernes 25 de julio a las 4:00pm?
          </label>
          <select
            id="talk"
            name="talk"
            required
            className="w-full px-2 py-2 text-xs rounded border text-sm border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {["Sí, podré asistir", "No, nos vemos en el Assessment."].map(
              (talks, index) => (
                <option key={index} value={talks}>
                  {talks}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="assessment" className="block text-sm mb-2 text-blue-400">
            ¿Puedes asistir al assessment el sábado 26 de julio?
          </label>
          <select
            name="assessment"
            id="assessment"
            required
            className="w-full px-2 py-2 text-xs rounded border text-sm border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {["Sí", "No"].map((assessment, index) => (
              <option key={index} value={assessment}>
                {assessment}
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
