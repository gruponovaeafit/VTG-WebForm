"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Button from "../UI/Button";

export default function PersonalForm() {
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
         <Button key="submit" type="submit" color="rojo" size="md" state="active" className="w-full">Level Up!</Button>
      ]}>
        <Input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Pepitx"
          borderColorClass="border-black"
          focusRingColorClass="focus:ring-white "
          labelColorClass="text-white"
          label="Nombre"
        />

        <Input
          type="text"
          id="secondName"
          name="secondName"
          required
          placeholder="Perez"
          borderColorClass="border-black"
          focusRingColorClass="focus:ring-white"
          labelColorClass="text-white"
          label="Apellidos"
        />
      </FormContainer>
      <ToastContainer />
    </>
  );
}
