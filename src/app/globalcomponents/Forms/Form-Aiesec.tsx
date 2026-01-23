"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";

export default function AiesecForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    
    // Validar el formulario antes de enviar
    if (!formElement.checkValidity()) {
      // Mostrar mensajes de validación del navegador
      formElement.reportValidity();
      return;
    }

    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/aiesec", {
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
      toast.success(result.notification?.message || "Formulario enviado con éxito.", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => router.push("/90+1"), // Redirige tras la notificación
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <FormContainer
        onSubmit={handleFormSubmit}
        containerClassName="relative w-full flex items-center justify-center px-3 sm:px-6 py-6 min-h-[300px]"
        buttons={[
          <Button key="submit" type="submit" variant="verde" size="md" state="active" theme="fifa" >SIGUIENTE</Button>
        ]}
      >
        <Select
          id="department"
          name="department"
          label="¿A qué departamento te gustaría ingresar?"
          labelColorClass="text-white"
          className="border-black focus:ring-2 focus:ring-white" 
          required
          options={[
            { label: "MXP: Gestión Humana", value: "MXP: Gestión Humana" },
            { label: "MKT: Mercadeo", value: "MKT: Mercadeo" },
            { label: "F&L: Finanzas", value: "F&L: Finanzas" },
            { label: "OGV: Voluntariados salientes", value: "OGV: Voluntariados salientes" },
            { label: "OGT: Pasantías salientes", value: "OGT: Pasantías salientes" },
            { label: "IGV: Voluntariados entrantes", value: "IGV: Voluntariados entrantes" },
            { label: "IGT: Pasantías entrantes", value: "IGT: Pasantías entrantes" },
          ]}
        />
        
      </FormContainer>
      <ToastContainer />
    </>
  );
}