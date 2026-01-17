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
        overlayClassName="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full"
        formClassName="space-y-4"
        buttons={[
          <Button type="submit" variant="verde" size="md" state="active" className="w-full" theme="fifa">SIGUIENTE</Button>
        ]}
      >
        <div className="mb-4">
          <label htmlFor="Departments" className="block text-sm mb-2 text-[#9A975F]">
            Departamentos
          </label>
          <div className="flex flex-col space-y-2">
            {["Edición", "Desarrollo Humano", "Mercadeo", "Relaciones Públicas"].map(
              (department, index) => (
                <label key={index} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="departments"
                    value={department}
                    className="form-checkbox text-[#9A975F] focus:ring-[#9A975F]"
                  />
                  <span className="ml-2 text-white">{department}</span>
                </label>
              )
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="assistance" className="block text-sm mb-2 text-[#9A975F]">
            ¿Asistirás a la charla informativa el viernes 25 de Julio a la 1:30pm? 
            <br />
            Salón 34-302
          </label>
         
          <Select
            id="assistance"
            name="assistance"
            required
            options={[
              { label: "Sí", value: "Sí" },
              { label: "No", value: "No" },
            ]}
            className="w-full px-4 py-2 rounded border border-[#9A975F] bg-black text-white focus:outline-none focus:ring-2 focus:ring-[#9A975F]"
          />
        </div>

        <div className="mb-4">
          <Input
            type="text"
            name="excuse"
            label="En caso de que no puedas ir a la charla. ¿Por qué no puedes asistir?"
            placeholder="Ingresa tu excusa aquí"
            required
            borderColorClass="border-[#9A975F]"
            focusRingColorClass="focus:ring-[#9A975F]"
            labelColorClass="text-[#9A975F]"
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
