"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";
import { encryptedFetch } from "@/lib/crypto";

interface RedirectResponse {
  redirectUrl?: string;
  notification?: {
    type: string;
    message: string;
  };
}

export default function GroupsForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await encryptedFetch(
        "/api/redirecting",
        Object.fromEntries(formData.entries()) as Record<string, unknown>
      );

      const result: RedirectResponse = await response.json();

      if (!response.ok) {
        toast.error(result.notification?.message || "Error en el servidor", {
          position: "top-center",
          autoClose: 1500,
        });
        return;
      }

      if (result.redirectUrl) {
        router.push(result.redirectUrl);
      } else {
        toast.error("No se recibió una URL de redirección", {
          position: "top-center",
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.", {
        position: "top-center",
        autoClose: 2000,
      });
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
            className="w-full"
            theme="fifa"
          >
            SIGUIENTE
          </Button>,
        ]}
      >
        
          <Select
            id="studentGroup"
            name="studentGroup"
            label="Grupo estudiantil"
            colorTheme="yellow"
            borderColorClass="border-black"
            focusRingColorClass="focus:ring-white"
            labelColorClass="text-white"
            options={[
              { label: "NOVA", value: "NOVA" },
              { label: "AIESEC", value: "AIESEC" },
              { label: "CLUBIN", value: "CLUBIN" },
              { label: "CLUBMERC", value: "CLUBMERC" },
              { label: "GPG", value: "GPG" },
              { label: "NEXOS", value: "NEXOS" },
              { label: "OE", value: "OE" },
              { label: "PARTNERS", value: "PARTNERS" },
              { label: "SERES", value: "SERES" },
              { label: "SPIE", value: "SPIE" },
              { label: "TUTORES", value: "TUTORES" },
              { label: "TVU", value: "TVU" },
              { label: "UN SOCIETY", value: "UN SOCIETY" },
            ]}
          />
        
      </FormContainer>
  );
}
