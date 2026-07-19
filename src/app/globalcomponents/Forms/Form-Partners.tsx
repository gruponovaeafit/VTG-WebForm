"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Button from "../UI/Button";
import { encryptedFetch } from "@/lib/crypto";

export default function PartnersForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const formDataObject = Object.fromEntries(formData.entries());

    try {
      const response = await encryptedFetch(
        "/api/forms/partners",
        formDataObject as Record<string, unknown>
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
        {/* Campo 2: ¿Vas a asistir a alguna de nuestras charlas informativas? */}
        <div className="mb-2">
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
              { label: "Mar. 21 jul 4:00 PM", value: "Mar. 21 jul 4:00 PM" },
              { label: "Mie. 22 jul 4:00 PM", value: "Mie. 22 jul 4:00 PM" },
              { label: "Jue. 23 jul 9:00 AM", value: "Jue. 23 jul 9:00 AM" },
              { label: "Jue. 23 jul 6:00 PM", value: "Jue. 23 jul 6:00 PM" },
            ]}
            className="w-full px-4 py-2 text-sm rounded border border-black bg-yellow text-black focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <div className="mb-4 w-full">
          <Input
            type="text"
            id="who"
            name="who"
            required
            placeholder="Nombre"
            title="Ingresa el nombre del partner que te inscribió"
            borderColorClass="border-black"
            focusRingColorClass="focus:ring-white"
            labelColorClass="text-white"
            label="Ingresa el nombre del partner que te inscribió"
          />
        </div>

      </FormContainer>
  );
}