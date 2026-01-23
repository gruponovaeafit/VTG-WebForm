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

      // Si todo está bien desde el servidor, muestra un toast de éxito y redirige a /90+1
      toast.success("Formulario enviado con éxito.", {
        position: "top-center",
        autoClose: 500,
        onClose: () => router.push("/90+1"),
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
        buttons={[
          <Button key="submit" type="submit" variant="verde" size="md" state="active" className="w-full" theme="fifa">SIGUIENTE</Button>
        ]}
      >
        {/* Campo 2: ¿Vas a asistir a alguna de nuestras charlas informativas? */}
        <div className="mb-4">
          <label
            htmlFor="talkSelection"
            className="block text-sm mb-2 text-white font-bold"
          >
            ¿Vas a asistir a alguna de nuestras charlas informativas?
          </label>
  
          <Select
            id="talkSelection"
            name="talkSelection"
            required
            options={[
              { label: "Mar. 27 ene 5 - 6 p.m.", value: "Mar. 27 ene 5 - 6 p.m." },
              { label: "Mie. 28 ene 5 - 6 p.m.", value: "Mie. 28 ene 5 - 6 p.m." },
              { label: "Jue. 29 ene 5 - 6 p.m.", value: "Jue. 29 ene 5 - 6 p.m." },
              { label: "Vie. 30 ene 9 - 10 a.m.", value: "Vie. 30 ene 9 - 10 a.m." },
            ]}
            className="w-full px-4 py-2 text-sm rounded border border-black bg-yellow text-black focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <div className="mb-4">
          <Input
            type="text"
            id="who"
            name="who"
            required
            placeholder="Nombre"
            title="Ingresa el nombre de quien te registró"
            borderColorClass="border-black"
            focusRingColorClass="focus:ring-white"
            labelColorClass="text-white"
            label="¿Quién te registró?"
          />
        </div>

      </FormContainer>
      <ToastContainer />
    </>
  );
}