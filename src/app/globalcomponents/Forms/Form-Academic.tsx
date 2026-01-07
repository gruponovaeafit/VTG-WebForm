"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";

export default function AcademicForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/Data-Academic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = await response.json();

      if (!response.ok) {
        // Manejo de errores en la respuesta del servidor
        toast.error(result.message || "Error en el servidor.", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Si todo está bien desde el servidor, muestra un toast de éxito y redirige a /groupslist
      toast.success(result.message || "Información guardada con éxito.", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => router.push("/groupslist"),
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
        overlayClassName="bg-gray-800 bg-opacity-90 p-3 rounded-lg shadow-lg max-w-md w-full"
        formClassName="space-y-4"
        buttons={[
          <button
            type="submit"
            className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300 text-sm sm:text-base transform hover:scale-105 active:scale-95"
          >
            Level Up!
          </button>
        ]}
      >
        <div className="mb-4">
          <Select
            id="programs"
            name="programs"
            label="Programa académico"
            required
            options={[
              { label: "Administración de Negocios", value: "Administración de Negocios" },
              { label: "Biología", value: "Biología" },
              { label: "Ciencias Políticas", value: "Ciencias Políticas" },
              { label: "Comunicación Social", value: "Comunicación Social" },
              { label: "Contaduría Pública", value: "Contaduría Pública" },
              { label: "Derecho", value: "Derecho" },
              { label: "Diseño Interactivo", value: "Diseño Interactivo" },
              { label: "Diseño Urbano y Gestión del Hábitat", value: "Diseño Urbano y Gestión del Hábitat" },
              { label: "Economía", value: "Economía" },
              { label: "Finanzas", value: "Finanzas" },
              { label: "Geología", value: "Geología" },
              { label: "Ingeniería Agronómica", value: "Ingeniería Agronómica" },
              { label: "Ingeniería Civil", value: "Ingeniería Civil" },
              { label: "Ingeniería de Diseño de Producto", value: "Ingeniería de Diseño de Producto" },
              { label: "Ingeniería Física", value: "Ingeniería Física" },
              { label: "Ingeniería Matemática", value: "Ingeniería Matemática" },
              { label: "Ingeniería Mecánica", value: "Ingeniería Mecánica" },
              { label: "Ingeniería de Procesos", value: "Ingeniería de Procesos" },
              { label: "Ingeniería de Producción", value: "Ingeniería de Producción" },
              { label: "Ingeniería de Sistemas", value: "Ingeniería de Sistemas" },
              { label: "Ingeniería Industrial", value: "Ingeniería Industrial" },
              { label: "Literatura", value: "Literatura" },
              { label: "Mercadeo", value: "Mercadeo" },
              { label: "Música", value: "Música" },
              { label: "Negocios Internacionales", value: "Negocios Internacionales" },
              { label: "Psicología", value: "Psicología" },
            ]}
          />
        </div>

        <div className="mb-4">
          <Select
            id="secondaryPrograms"
            name="secondaryPrograms"
            label="Programa académico Secundario"
            required
            options={[
              { label: "No Aplica", value: "No Aplica" },
              { label: "Administración de Negocios", value: "Administración de Negocios" },
              { label: "Biología", value: "Biología" },
              { label: "Ciencias Políticas", value: "Ciencias Políticas" },
              { label: "Comunicación Social", value: "Comunicación Social" },
              { label: "Contaduría Pública", value: "Contaduría Pública" },
              { label: "Derecho", value: "Derecho" },
              { label: "Diseño Interactivo", value: "Diseño Interactivo" },
              { label: "Diseño Urbano y Gestión del Hábitat", value: "Diseño Urbano y Gestión del Hábitat" },
              { label: "Economía", value: "Economía" },
              { label: "Finanzas", value: "Finanzas" },
              { label: "Geología", value: "Geología" },
              { label: "Ingeniería Agronómica", value: "Ingeniería Agronómica" },
              { label: "Ingeniería Civil", value: "Ingeniería Civil" },
              { label: "Ingeniería de Diseño de Producto", value: "Ingeniería de Diseño de Producto" },
              { label: "Ingeniería Física", value: "Ingeniería Física" },
              { label: "Ingeniería Matemática", value: "Ingeniería Matemática" },
              { label: "Ingeniería Mecánica", value: "Ingeniería Mecánica" },
              { label: "Ingeniería de Procesos", value: "Ingeniería de Procesos" },
              { label: "Ingeniería de Producción", value: "Ingeniería de Producción" },
              { label: "Ingeniería de Sistemas", value: "Ingeniería de Sistemas" },
              { label: "Literatura", value: "Literatura" },
              { label: "Mercadeo", value: "Mercadeo" },
              { label: "Música", value: "Música" },
              { label: "Negocios Internacionales", value: "Negocios Internacionales" },
              { label: "Psicología", value: "Psicología" },
            ]}
          />
        </div>

        <div className="mb-4">
          <Select
            id="semester"
            name="semester"
            label="¿En qué semestre te encuentras matriculadx?"
            required
            options={[
              ...Array.from({ length: 10 }, (_, i) => ({
                label: `${i + 1}`,
                value: `${i + 1}`,
              })),
              { label: "10+", value: "10+" },
            ]}
          />
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
