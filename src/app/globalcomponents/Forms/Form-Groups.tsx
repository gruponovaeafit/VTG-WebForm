"use client";

import { useRouter } from "next/navigation";
import FormContainer from "../UI/FormContainer";
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
      <div className="mb-4">
        <label htmlFor="studentGroup" className="block text-m mb-2 text-teal-400">
          Grupo estudiantil de interés
        </label>
        <select
          id="studentGroup"
          name="studentGroup"
          required
          className="w-full px-4 py-2 rounded border border-teal-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {[
            "NOVA",
          ].map((group, index) => (
            <option key={index} value={group}>{group}</option>
          ))}
        </select>
      </div>
    </FormContainer>
    </>
  );
}
