"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
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
          
          <Select
            id="committie"
            name="committie"
            required
            className="w-full px-4 py-2 text-xs rounded border border-red-600 bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            options={[
              { label: "Comité de Publicidad", value: "Comité de Publicidad" },
              { label: "Comité de Divulgación", value: "Comité de Divulgación" },
              { label: "Comité de RRPP", value: "Comité de RRPP" },
              { label: "Comité de GH", value: "Comité de GH" },
            ]}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="talk"
            className="block text-sm mb-2 text-red-600 "
          >
            ¿A que charla informativa puedes asistir?
          </label>
      
          <Select
            id="talk"
            name="talk"
            required
            className="w-full px-4 py-2 text-sm rounded border border-red-600 bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
            options={[
              { label: "Vie. 25 Jul, 4:00 p.m.", value: "Vie. 25 Jul, 4:00 p.m." },
              { label: "Mie. 30 Jul, 6:00 p.m.", value: "Mie. 30 Jul, 6:00 p.m." },
              { label: "Vie. 1 Ago, 4:00 p.m.", value: "Vie. 1 Ago, 4:00 p.m." },
            ]}
          />
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
