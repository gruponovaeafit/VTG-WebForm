"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";
import Input from "../UI/Input";
import { encryptedFetch } from "@/lib/crypto";

export default function UnForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await encryptedFetch(
        "/api/forms/un",
        Object.fromEntries(formData.entries()) as Record<string, unknown>
      );

      const result = await response.json();

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

      const successMessage = result.notification?.message || "Formulario enviado con éxito";
      toast.success(successMessage, {
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
        <div className="mb-2">
          
          <Select
            id="comite"
            name="comite"
            label="¿A qué comité te gustaría ingresar?"
            labelColorClass="text-white"
            required
            options={[
              { label: "Publicidad y Redes", value: "Publicidad y Redes" },
              { label: "Gestión Humana", value: "Gestión Humana" },
              { label: "Relaciones Públicas", value: "Relaciones Públicas" },
              { label: "Logística", value: "Logística" },
              { label: "Académico", value: "Académico" },
            ]}
          />
        </div>

        <div className="mb-2">
          <Select
            id="talk"
            name="talk"
            label="¿A qué charla te gustaría asistir?"
            labelColorClass="text-white"
            required
            options={[
              { label: "Vie. 30 de enero 2:00 p.m. – 3:30 p.m.", value: "Vie. 30 de enero 2:00 p.m. – 3:30 p.m." },
              { label: "Vie. 30 de enero 4:00 p.m. – 5:30 p.m.", value: "Vie. 30 de enero 4:00 p.m. – 5:30 p.m." },
            ]}
          />
        </div>  
      </FormContainer>
  );
}
