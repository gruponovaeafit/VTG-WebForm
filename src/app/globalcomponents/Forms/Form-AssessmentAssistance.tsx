"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";

import Button from "../UI/Button";
import { encryptedFetch } from "@/lib/crypto";
export default function AssessmentAssistanceForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await encryptedFetch(
        "/api/Data-AssessmentAssistance",
        Object.fromEntries(formData.entries()) as Record<string, unknown>
      );

      const result = await response.json();

      if (!response.ok) {
        // Manejo de errores en la respuesta del servidor
        if (result.notification) {
          toast.error(result.notification.message, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Ocurrió un error al enviar el formulario.", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        return;
      }

      // Éxito
      toast.success(result.notification.message, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          if (result.redirectUrl) {
            router.push(result.redirectUrl);
          } else {
            // Si no hay redirectUrl, por defecto a /home
            router.push("/home");
          }
        },
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Error interno al enviar el formulario.", {
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
      ]}>
        <div className="mb-4">
          <Select
            id="talk"
            name="talk"
            label="¿Vas a asistir al assessment?"
            required
            options={[
              { label: "Sí", value: "Sí" },
              { label: "No", value: "No" },
            ]}
          />
        </div>
      </FormContainer>
  );
}
