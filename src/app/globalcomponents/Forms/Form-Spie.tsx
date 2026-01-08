"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Button from "../UI/Button";

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
    <>
      <FormContainer
        onSubmit={handleFormSubmit}
        overlayClassName="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
        formClassName="space-y-4"
        buttons={[
          <Button type="submit" color="rojo" size="md" state="active" className="w-full">Level Up!</Button>
        ]}
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
            htmlFor="talk"
            className="block text-sm mb-2 text-red-600 "
          >
            ¿A que charla informativa puedes asistir?
          </label>
          <select
            id="talk"
            name="talk"
            required
            className="w-full px-4 py-2 text-sm rounded border border-red-600 bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
          >
            {[
              "Vie. 25 Jul, 4:00 p.m.",
              "Mie. 30 Jul, 6:00 p.m.",
              "Vie. 1 Ago, 4:00 p.m.",
            ].map((talks, index) => (
              <option key={index} value={talks}>
                {talks}
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
      </FormContainer>
      <ToastContainer />
    </>
  );
}
