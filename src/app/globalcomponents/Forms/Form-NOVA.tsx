"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Button from "../UI/Button";

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
          <Button key="submit" type="submit" variant="verde" size="md" state="active" className="w-full" theme="fifa">SIGUIENTE</Button>
        ]}
      >

        <Select
          id="talk"
          name="talk"
          label="¿A qué charla informartiva asistirás?"
          required
          options={[
            { label: "Jue. 24 jul, 12-1 p.m.", value: "Jue. 24 jul, 12-1 p.m." },
            { label: "Vie. 25 jul, 2-3 p.m.", value: "Vie. 25 jul, 2-3 p.m." },
            { label: "Mié. 30 jul, 5-6 p.m.", value: "Mié. 30 jul, 5-6 p.m." },
          ]}
        />

        <div className="mb-4">
          <Input
            type="text"
            name="IdNovato"
            label="Nombre del Novatto/a que te inscribió"
            placeholder="Novatto/a"
            required
            borderColorClass="border-purple-600"
            focusRingColorClass="focus:ring-purple-700"
            labelColorClass="text-purple-600"
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}