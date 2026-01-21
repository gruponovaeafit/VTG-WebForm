"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Button from "../UI/Button";

export default function OEForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const formDataObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/forms/oe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
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
      toast.success(result.message || "Formulario enviado con éxito.", {
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
          <Button key="submit" type="submit" variant="verde" size="md" state="active" className="w-full" theme="fifa">SIGUIENTE</Button>
        ]}
      >
        <div className="mb-4">
          <label htmlFor="programs" className="block text-m mb-2 text-white font-bold">
            ¿Puedes asistir a nuestra charla informativa para conocer más sobre nuestros comités y el grupo?
          </label>
          <label htmlFor="programs" className="block text-m mb-2 text-blue-400 font-bold">
             Viernes 30 de enero 2:00 p.m. – 5:00 p.m.
          </label>

          <Select
            id="talk"
            name="talk"
            required
            options={[
              { label: "Si", value: "Si" },
              { label: "No", value: "No" },
            ]}
            className="border-black focus:ring-2 focus:ring-white"
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
