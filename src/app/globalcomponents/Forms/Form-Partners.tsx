"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Button from "../UI/Button";

export default function PartnersForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const formDataObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/forms/partners", {
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
      toast.success("Formulario enviado con éxito.", {
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
          <Button key="submit" type="submit" color="rojo" size="md" state="active" className="w-full">Level Up!</Button>
        ]}
      >
        
        <div className="mb-4">
          <Input
            type="text"
            id="who"
            name="who"
            required
            placeholder="Nombre"
            title="Ingresa el nombre de quien te registró"
            borderColorClass="border-orange-400"
            focusRingColorClass="focus:ring-orange-400"
            labelColorClass="text-orange-400"
            label="¿Quién te registró?"
          />
        </div>

        {/* Campo 2: ¿Vas a asistir a alguna de nuestras charlas informativas? */}
        <div className="mb-4">
          <label
            htmlFor="talkSelection"
            className="block text-sm mb-2 text-orange-400"
          >
            ¿Vas a asistir a alguna de nuestras charlas informativas?
          </label>
  
          <Select
            id="talkSelection"
            name="talkSelection"
            required
            options={[
              { label: "Mar. 22 Julio, 5 p.m.", value: "Mar. 22 Julio, 5 p.m." },
              { label: "Mie. 23 Julio, 5 p.m.", value: "Mie. 23 Julio, 5 p.m." },
              { label: "Jue. 24 Julio, 5 p.m.", value: "Jue. 24 Julio, 5 p.m." },
              { label: "Vie. 25 Julio, 9 a.m.", value: "Vie. 25 Julio, 9 a.m." },
            ]}
            className="w-full px-4 py-2 text-sm rounded border border-orange-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

      </FormContainer>
      <ToastContainer />
    </>
  );
}