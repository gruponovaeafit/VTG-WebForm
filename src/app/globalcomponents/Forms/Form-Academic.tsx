"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Button from "../UI/Button";

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
        containerClassName="w-full flex items-center justify-center px-0"
        buttons={[
          <Button
            key="submit" type="submit" variant="verde" size="md" state="active" className="w-full" theme="fifa">SIGUIENTE</Button>
          ]}
      >

        {/*Campos del formulario*/}
        <div className="space-y-4">
          <div>
            <Select
              id="programs"
              name="programs"
              required
              label="Pregrado"
              colorTheme="yellow"
              borderColorClass="border-black"
              focusRingColorClass="focus:ring-white"
              labelColorClass="text-white"
        
              
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
                { label: "Ingeniería de Construcción", value: "Ingeniería de Construcción" },
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
                { label: "Programa E", value: "Programa E" },
                { label: "Psicología", value: "Psicología" },
              ]}
            />
          </div>

          <div>
            <Select
              id="secondaryPrograms"
              name="secondaryPrograms"
              label="2° pregrado"
              required
              colorTheme="yellow"
              borderColorClass="border-black"
              focusRingColorClass="focus:ring-white"
              labelColorClass="text-white"
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
                { label: "Ingeniería de Construcción", value: "Ingeniería de Construcción" },
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
                { label: "Programa E", value: "Programa E" },
                { label: "Psicología", value: "Psicología" },
              ]}
            />
          </div>

          <div>
            <Select
              id="semester"
              name="semester"
              label="Semestre"
              required
              colorTheme="yellow"
              borderColorClass="border-black"
              focusRingColorClass="focus:ring-white"
              labelColorClass="text-white"
              options={[
                ...Array.from({ length: 10 }, (_, i) => ({
                  label: `Semestre ${i + 1}`,
                  value: `${i + 1}`,
                })),
                { label: "10+", value: "10+" },
              ]}
            />
          </div>
        </div>
      </FormContainer>

      <ToastContainer />
    </>
  );
}
