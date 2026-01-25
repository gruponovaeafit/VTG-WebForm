"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { encryptedFetch } from "@/lib/crypto";

export default function PersonalForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await encryptedFetch(
        "/api/Data-Personal",
        Object.fromEntries(formData.entries()) as Record<string, unknown>
      );

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <FormContainer onSubmit={handleFormSubmit} buttons={[
         <Button key="submit" type="submit" variant="verde" size="md" state={isSubmitting ? "loading" : "active"} disabled={isSubmitting} className="w-full" theme="fifa">SIGUIENTE</Button>
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
  );
}
