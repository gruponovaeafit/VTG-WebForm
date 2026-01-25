"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Button from "../UI/Button";
import { encryptedFetch } from "@/lib/crypto";

export default function NOVAForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await encryptedFetch(
        "/api/forms/nova",
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
        onClose: () => router.push("/90+1"),
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

        <div className="mb-2">
          <Select
            id="charla"
            name="charla"
            label="¿A qué charla te gustaría asistir?"
            required
            options={[
              { label: "Jue. enero 29, 12:00M - 2:00PM", value: "Jue. enero 29, 12:00M - 2:00PM" },
              { label: "Jue. enero 29, 6:00PM - 7:00PM", value: "Jue. enero 29, 6:00PM - 7:00PM"},
              { label: "Mar. febrero 3, 6:00PM - 7:00PM", value: "Mar. febrero 3, 6:00PM - 7:00PM"},
            ]}
            labelColorClass="text-white"
            borderColorClass="border-black"
            focusRingColorClass="focus:ring-white"
          />
        </div>
        <div className="mb-2">
          <Select
            id="departmento"
            name="departmento"
            label="¿A qué departamento te gustaría ingresar?"
            required
            options={[
              { label: "Gestión Humana", value: "Gestión Humana" },
              { label: "Relaciones Públicas", value: "Relaciones Públicas"},
              { label: "Communities", value: "Communities"},
              { label: "Mercadeo", value: "Mercadeo"},
            ]}
            labelColorClass="text-white"
            borderColorClass="border-black"
            focusRingColorClass="focus:ring-white"
          />
        </div>
        <div className="mb-2">
          <Input
            id="nombre_miembro"
            name="nombre_miembro"
            label="Nombre del Novatto/a que te inscribió"
            placeholder="Novatto/a"
            required
          />
        </div>
      </FormContainer>
  );
}