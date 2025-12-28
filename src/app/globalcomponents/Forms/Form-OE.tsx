"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";

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
          <label htmlFor="programs" className="block text-m mb-2 text-blue-400">
            ¿Puedes asistir a nuestra convocatoria para conocer más sobre el grupo?
          </label>
          <label htmlFor="programs" className="block text-m mb-2">
            Próximo viernes 25 de Julio a las 3:00pm
          </label>
          <select
            id="talk"
            name="talk"
            required
            className="w-full px-2 py-2 rounded border border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {["Si", "No"].map((program, index) => (
              <option key={index} value={program}>
                {program}
              </option>
            ))}
          </select>
          <label
            htmlFor="asesor"
            className="block text-m mb-4 mt-4 text-blue-400"
          >
            Nombre de la persona que te inscribió
          </label>
          <input
            type="text"
            id="asesor"
            name="asesor"
            placeholder="Asesor"
            title="IdTutor"
            className="w-full px-4 py-2 rounded border border-blue-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-70"
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
