"use client";

import { useRouter } from "next/navigation";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";

export default function GroupsForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/redirecting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())), // Convierte FormData a JSON
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      const { redirectUrl } = await response.json();

      if (redirectUrl) {
        router.push(redirectUrl); // Redirige a la página correspondiente
      } else {
        throw new Error("No se recibió una URL de redirección");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <>
      <FormContainer
        onSubmit={handleFormSubmit}
        buttons={[
          <Button
            key="submit"
            type="submit"
            variant="verde"
            size="md"
            state="active"
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
    </>
  );
}
