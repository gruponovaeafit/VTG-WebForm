"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Button from "../UI/Button";
import { encryptedFetch } from "@/lib/crypto";

export default function GpgForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await encryptedFetch(
        "/api/forms/gpg",
        Object.fromEntries(formData.entries()) as Record<string, unknown>
      );

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
      toast.success(result.message || "Formulario enviado con éxito.", {
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
        autoClose: 1500,
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
        <div className="mb-4">
          <Select
            id="talk"
            name="talk"
            label="¿A qué charla te gustaría asistir?"
            labelColorClass="text-white"
            required
            options={[
              { label: "Jue. 23 jul 5:00 p.m. 33-102", value: "Jue. 23 jul 5:00 p.m. 33-102" },
              { label: "Jue. 23 jul 5:00 p.m. 33-404", value: "Jue. 23 jul 5:00 p.m. 33-404" },
              { label: "Vie. 24 jul 3:00 p.m. 38-204", value: "Vie. 24 jul 3:00 p.m. 38-204" },
              { label: "Vie. 24 jul 3:00 p.m. 38-304", value: "Vie. 24 jul 3:00 p.m. 38-304" },
            ]}
          />
        </div>

        <Select
          id="practice"
          name="practice"
          label="¿Estás viendo pre-práctica?"
          labelColorClass="text-white"
          required
          options={[
            { label: "Sí", value: "Sí" },
            { label: "No", value: "No" },
          ]}
        />

      </FormContainer>
  );
}
