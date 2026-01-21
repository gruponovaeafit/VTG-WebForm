"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormContainer from "../UI/FormContainer";
import Select from "../UI/Select";
import Input from "../UI/Input";
import Button from "../UI/Button";

export default function SpieForm() {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    
    // Validar el formulario antes de enviar
    if (!form.checkValidity()) {
      // Mostrar mensajes de validación del navegador
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/forms/spie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Error en el servidor.", {
          position: "top-center",
          autoClose: 1000,
          onClose: () => {
            if (result.message === "Ya estás registrado en este grupo.") {
              router.push("/groupslist");
            }
          },
        });
        return;
      }

      toast.success("Formulario enviado con éxito", {
        position: "top-center",
        autoClose: 500,
        onClose: () => router.push("/gameover"),
      });
    } catch {
      toast.error("Error al enviar el formulario.", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen items-start justify-center pt-12 md:pt-20 px-4 overflow-hidden">
        <Image
          src="/forma-spie1.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 left-0 z-0 pointer-events-none select-none"
        />

        <Image
          src="/forma-spie2.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 right-0 z-0 pointer-events-none select-none"
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-2 md:mb-4">
            <Image
              src="/spie-logo.png"
              alt="SPIE Logo"
              width={140}
              height={140}
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
              id="comite"
              name="comite"
              label="¿A qué comité te gustaría ingresar?"
              required
              labelColorClass="text-white"
              options={[
                { label: "Comité de Publicidad", value: "Comité de Publicidad" },
                { label: "Comité de Divulgación", value: "Comité de Divulgación" },
                { label: "Comité de RRPP", value: "Comité de RRPP" },
                { label: "Comité de GH", value: "Comité de GH" },
              ]}
            />

            <Select
              id="talk"
              name="talk"
              label="¿A qué charla te gustaría asistir?"
              required
              labelColorClass="text-white"
              options={[
                { label: "Vie. 25 Jul, 4:00 p.m.", value: "Vie. 25 Jul, 4:00 p.m." },
                { label: "Mie. 30 Jul, 6:00 p.m.", value: "Mie. 30 Jul, 6:00 p.m." },
                { label: "Vie. 1 Ago, 4:00 p.m.", value: "Vie. 1 Ago, 4:00 p.m." },
              ]}
            />

            <Input
              type="text"
              name="referral_name"
              label="Nombre del que te dio la información"
              placeholder="Nombre"
              required
            />
          </FormContainer>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
