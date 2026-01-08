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
    <FormContainer onSubmit={handleFormSubmit} overlayClassName="bg-gray-800 bg-opacity-90 p-3 rounded-lg shadow-lg max-w-md w-full" formClassName="space-y-4" buttons={[
      <Button type="submit" color="rojo" size="md" state="active" className="w-full">Level Up!</Button>
    ]}>
        <Select
          id="studentGroup"
          name="studentGroup"
          label="Grupo estudiantil de interés"
          required
          options={[
            { label: "NOVA", value: "NOVA" },
          ]}
        />
      </FormContainer>
    </>
  );
}
