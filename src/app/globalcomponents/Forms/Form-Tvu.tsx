"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";

export default function TvuForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/tvu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

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
      toast.success("Formulario enviado con éxito", {
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
    }
  };

  return (
    <>
      <FormContainer
        onSubmit={handleFormSubmit}
        buttons={[
          <Button key="submit" type="submit" variant="verde" size="md" state="active" className="w-full" theme="fifa">SIGUIENTE</Button>
        ]}
      >
        <div className="mb-2 w-full">
          <label htmlFor="talks" className="block text-m mb-4 text-white font-bold">
            ¿A qué charla informativa deseas asistir?
          </label>

          <Select
            id="talk"
            name="talk"
            required
            className="border-black focus:ring-2 focus:ring-white"
            options={[
              { label: "Mie. 28 ene 6:00PM-7:00PM", value: "Mie. 28 ene 6:00PM-7:00PM" },
              { label: "Jue. 29 ene 6:00PM-7:00PM", value: "Jue. 29 ene 6:00PM-7:00PM" },
              { label: "Vie. 30 ene 12:00M-1:00PM", value: "Vie. 30 ene 12:00M-1:00PM" },
            ]}
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
