"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";

export default function SeresForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/seres", {
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

      // Si todo está bien desde el servidor, muestra un toast de éxito y redirige a /gameover
      toast.success("Formulario enviado con éxito", {
        position: "top-center",
        autoClose: 500,
        onClose: () => router.push("/gameover"),
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
          <Button type="submit" variant="verde" size="md" state="active" className="w-full" theme="fifa">SIGUIENTE</Button>
        ]}
      >
        <div className="mb-4">
          <label htmlFor="talks" className="block text-sm mb-2 text-white font-bold">
            ¿A qué charla informativa deseas asistir?
          </label>
        
          <Select
            id="talk"
            name="talk"
            required
            className="w-full px-2 py-2 text-sm rounded border border-bl bg-yellow text-black focus:outline-none focus:ring-2 focus:ring-white"
            options={[
              { label: "Vie. 30 ene, 9-10 a.m.", value: "Vie. 30 ene, 9-10 a.m." },
              { label: "Vie. 30 ene, 11-12 m", value: "Vie. 30 ene, 11-12 m" },
              { label: "Vie. 30 ene, 2-3 p.m.", value: "Vie. 30 ene, 2-3 p.m." },
              { label: "Vie. 30 ene, 3-4 p.m.", value: "Vie. 30 ene, 3-4 p.m." },
            ]}
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
