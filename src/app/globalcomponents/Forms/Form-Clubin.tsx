"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";
import { encryptedFetch } from "@/lib/crypto";

export default function Clubin1Form() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await encryptedFetch(
        "/api/forms/clubin",
        payload as Record<string, unknown>
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result.notification?.message || result.message || "Error en el servidor.";

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 1000,
          pauseOnHover: false,
          onClose: () => {
            if (errorMessage === "Ya estás registrado en este grupo.") {
              router.push("/groupslist");
            }
          },
        });
        return;
      }

      toast.success(result.notification?.message || "Formulario enviado con éxito.", {
        position: "top-center",
        autoClose: 500,
        onClose: () => router.push("/90+1"),
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Hubo un error al enviar el formulario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer
      onSubmit={handleFormSubmit}
      buttons={[
        <Button
          key="submit"
          type="submit"
          variant="verde"
          size="md"
          state={isSubmitting ? "loading" : "active"}
          disabled={isSubmitting}
          className="w-full h-14 md:px-15"
          theme="fifa"
        >
          SIGUIENTE
        </Button>,
      ]}
    >
      <div className="mb-4">
        <Select
          id="charla"
          name="charla"
          label="Inscribete a un horario de charla informativa (si no puedes en ninguna notifica a través del correo clinbin@eafit.edu.co)"
          labelColorClass="text-white"
          required
          options={[
            { label: "Miércoles Jul. 22 11:00 AM - 12:00 PM", value: "Miércoles Jul. 22 11:00 AM - 12:00 PM" },
            { label: "Miércoles Jul. 22 3:00 PM - 4:00 PM", value: "Miércoles Jul. 22 3:00 PM - 4:00 PM" },
            { label: "Jueves Jul. 23 3:00 PM - 4:00 PM", value: "Jueves Jul. 23 3:00 PM - 4:00 PM" },
            { label: "Viernes Jul. 24 11:00 AM - 12:00 PM", value: "Viernes Jul. 24 11:00 AM - 12:00 PM" },
            { label: "Viernes Jul. 24 12:00 PM - 1:00 PM", value: "Viernes Jul. 24 12:00 PM - 1:00 PM" },
          ]}
        />
      </div>

      <div className="mb-4">
        <Select
          id="practica"
          name="practica"
          label="¿Harás la práctica académica en el próximo año?"
          labelColorClass="text-white"
          required
          options={[
            { label: "2026-2", value: "2026-2" },
            { label: "2027-1", value: "2027-1" },
            { label: "Ninguno", value: "Ninguno" },
          ]}
        />
      </div>

      <div className="mb-4">
        <Select
          id="intercambio"
          name="intercambio"
          label="¿Estás de intercambio académico o harás uno el próximo semestre?"
          labelColorClass="text-white"
          required
          options={[
            { label: "Sí", value: "Si" },
            { label: "No", value: "No" },
          ]}
        />
      </div>
    </FormContainer>
  );
}
