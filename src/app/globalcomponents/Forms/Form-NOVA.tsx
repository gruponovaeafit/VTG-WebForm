"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Button from "../UI/Button";

export default function NOVAForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/forms/nova", {
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
      toast.success(result.message || "Formulario enviado con éxito.", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => router.push("/gameover"),
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

       <div className="relative z-10 flex flex-col items-center">
         <div className="mb-2 md:mb-4">
            <Image
                src="/NOVA_logo_2.svg"
                alt="NOVA Logo"
                width={200}
                height={200}
                className="md:w-[180px]"
                priority
             />
       </div>

      <FormContainer
        onSubmit={handleFormSubmit}
        buttons={[
          <Button key="submit" type="submit" variant="verde" size="md" state="active" className="w-full" theme="fifa">SIGUIENTE</Button>
        ]}
      >

        <Select
          id="talk"
          name="talk"
          label="¿A qué charla te gustaría asistir?"
          labelColorClass="text-white"
          required
          options={[
            { label: "Jue. 24 jul, 12-1 p.m.", value: "Jue. 24 jul, 12-1 p.m." },
            { label: "Vie. 25 jul, 2-3 p.m.", value: "Vie. 25 jul, 2-3 p.m." },
            { label: "Mié. 30 jul, 5-6 p.m.", value: "Mié. 30 jul, 5-6 p.m." },
          ]}
        />

        <Select
          id="committie"
          name="committie"
          label="¿A qué depto te gustaría entrar?"
          labelColorClass="text-white"
          required
          options={[
            { label: "Communities", value: "Communities" },
            { label: "R.R.P.P.", value: "R.R.P.P." },
            { label: "G.H.", value: "G.H." },
            { label: "Mercadeo", value: "Mercadeo" },
          ]}
        />

        <div className="mb-4">
          <Input
            type="text"
            name="IdNovato"
            label="Nombre del Novatto/a que te inscribió"
            placeholder="Novatto/a"
            required
          />
        </div>
      </FormContainer>
      </div>
      <ToastContainer />
    </>
  );
}