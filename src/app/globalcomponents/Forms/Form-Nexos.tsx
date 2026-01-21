"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Button from "../UI/Button";

export default function NexosForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Recopilar los valores de los checkboxes seleccionados
    const departments = formElement.querySelectorAll(
      'input[name="departments"]:checked'
    );
    const departmentsArray = Array.from(departments).map(
      (checkbox) => (checkbox as HTMLInputElement).value
    );

    // Convertir el array de departamentos a una cadena de texto separada por comas
    const departmentsString = departmentsArray.join(", ");

    // Agregar los departamentos al formData
    formData.append("departments", departmentsString);

    const formDataObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/forms/nexos", {
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
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => router.push("/gameover"), // Redirige tras la notificación
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
        {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  return (
    <>
      <FormContainer
        onSubmit={handleFormSubmit}
        buttons={[
          <Button key="submit" type="submit" variant="verde" size="md" state="active" theme="fifa" className="w-full h-14 md:px-15">SIGUIENTE</Button>
        ]}
      >
        <div className="mb-4">
          <Select
            id="talk"
            name="talk"
            label="A qué charla informativa asistirás?"
            colorTheme="yellow"
            borderColorClass="border-black"
            focusRingColorClass="focus:ring-white"
            labelColorClass="text-white"
            required
            options={[
              { label: "Jue. enero 29, 6:00PM", value: "Jue. enero 29, 6:00PM" },
              { label: "Vie. enero 30, 12:00M", value: "Vie. enero 30, 12:00M"},
            ]}
            className="w-full px-4 py-2 text-sm rounded border border-black bg-yellow text-black focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div className="mb-4">
          <Input
            type="text"
            name="name"
            label="¿Quién te inscribió?"
            placeholder="Nombre"
            required={false}
            borderColorClass="border-black"
            focusRingColorClass="focus:ring-white"
            labelColorClass="text-white"
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}