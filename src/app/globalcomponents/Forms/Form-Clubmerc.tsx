"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";
import { encryptedFetch } from "@/lib/crypto";

export default function ClubmercForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await encryptedFetch(
        "/api/forms/clubmerc",
        Object.fromEntries(formData.entries()) as Record<string, unknown>
      );

      const result = await response.json();

      // Manejo de errores en la respuesta del servidor
      if (!response.ok) {
        const errorMessage = result.notification?.message || result.message || "Error en el servidor.";

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
      const successMessage = result.notification?.message || result.message || "Formulario enviado con éxito.";
      toast.success(successMessage, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => router.push("/90+1"), // Redirige tras la notificación
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
      <FormContainer
        onSubmit={handleFormSubmit}
        buttons={[
          <Button key="submit" type="submit" variant="verde" size="md" state={isSubmitting ? "loading" : "active"} disabled={isSubmitting} className="w-full" theme="fifa">SIGUIENTE</Button>
        ]}
      >
        <Select
          id="committieSelect"
          name="committieSelect"
          label="Comités"
          labelColorClass="text-white"
          required
          options={[
            { label: "Relaciones Públicas", value: "Relaciones Públicas" },
            { label: "Publicidad y Mercadeo", value: "Publicidad y Mercadeo" },
            { label: "Conexión Estratégica", value: "Conexión Estratégica" },
            { label: "Gestión Humana", value: "Gestión Humana" },
          ]}
        />


      </FormContainer>
  );
}
