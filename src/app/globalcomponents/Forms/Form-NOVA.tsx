"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";

export default function NOVAForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/nova", {
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
      toast.success(result.message || "Formulario enviado con éxito.", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => router.push("/gameover"),
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
        {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  return (
    <>
      <FormContainer
        onSubmit={handleFormSubmit}
        overlayClassName="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
        formClassName="space-y-4"
        buttons={[
          <button type="submit" className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300">Level Up!</button>
        ]}
      >
        <div className="mb-4">
          <label htmlFor="talk" className="block text-sm mb-2 text-purple-600">
            ¿A qué charla informartiva asistirás?
          </label>
          <select
            id="talk"
            name="talk"
            required
            className="w-full px-4 py-2 text-sm rounded border border-purple-600 bg-black text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            {[
              "Jue. 24 jul, 12-1 p.m.",
              "Vie. 25 jul, 2-3 p.m.",
              "Mié. 30 jul, 5-6 p.m.",
            ].map((group, index) => (
              <option key={index} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="IdNovato"
            className="block text-sm mb-2 text-purple-600"
          >
            Nombre del Novatto/a que te inscribió
          </label>
          <input
            type="text"
            id="IdNovato"
            name="IdNovato"
            required
            placeholder="Novatto/a"
            title="IdNovato"
            className="w-full px-4 py-2 rounded border border-purple-600 bg-black text-white text-sm placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-purple-700 placeholder:opacity-70"
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}